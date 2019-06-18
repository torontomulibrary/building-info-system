import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { MatchResults, RouterHistory } from '@stencil/router';

import { BASE_URL } from '../../global/config';
import {
  APP_DATA,
  MAP_TYPE,
  ROUTES,
} from '../../global/constants';
import {
  BookAvailability,
  BookDetails,
  Building,
  BuildingMap,
  ComputerAvailability,
  ComputerLab,
  ComputerLabMap,
  Floor,
  FloorMap,
  MapElementData,
  MapElementDataMap,
  MapElementDetail,
  MapElementDetailMap,
} from '../../interface';
import { dataService } from '../../utils/data-service';
import { fetchIMG } from '../../utils/fetch';
import { loadData } from '../../utils/load-data';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  private _buildingData!: BuildingMap;
  private _floorData!: FloorMap;
  private _elementData!: MapElementDataMap;
  private _detailData!: MapElementDetailMap;
  private _bookData?: BookDetails;
  private _compLabs!: ComputerLabMap;

  private _building!: Building;
  private _element?: MapElementData;
  private _floor!: Floor;
  private _floorplan = '';

  private extraDetails: {} = {};

  private oldParams: { [key: string]: string } = {};
  /**
   * Any URL matches for determining pre-selected building, floor and element.
   */
  private paramMatches?: RegExpExecArray | null;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLViewMapElement;

  @State() loaded = false;

  /**
   * A string matched from the URL that should be used to pre-select a specific
   * building, building and floor, or building, floor and element.
   */
  @State() query = '';

  private activeBuildingId!: number;
  private activeFloorId!: number;
  private activeElementId?: number;

  /**
   * A global flag passed in to indicate if the application has loaded as well.
   */
  @Prop() appLoaded = false;

  @State() mapType: MAP_TYPE = MAP_TYPE.LOCN;

  /**
   * The results coming from `stencil-router` that contain any URL matches.
   */
  @Prop() match!: MatchResults;

  /**
   * Event fired when the data specific to this view is finished loading.
   */
  @Event() dataLoaded!: EventEmitter;

  /**
   * Reference to the stencil-router history object. Used to programmatically
   * change the browser history when the selected FAQ changes.
   */
  @Prop() history!: RouterHistory;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentWillLoad() {
    this._loadData();

    return this._parseParameters();
    // this.loaded = true;
  }

  componentDidLoad() {
    this.checkSize();
  }

  componentWillUpdate() {
    return this._parseParameters();
  }

  checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this.checkSize();
      });
    } else {
      this.loaded = true;
    }
  }

  private _parseParameters() {
    // Check the URL value to see if any Building, Floor and or Location was
    // provided.  Must be in the form BLD[FLR][RM].
    // Where BLD is the three letter building code, FLR is the floor number,
    // and RM is the 'room number'.  The `room number` is actually the full
    // location code (e.g. SLC508)
    return new Promise(async resolve => {
      // Check if parameters have changed.
      if (this.match && this.match.params) {
        if (this.oldParams.mapType === this.match.params.mapType &&
            this.oldParams.id === this.match.params.id &&
            this.oldParams.ref === this.match.params.ref) {
              // Parameters unchanged, no need to process further.
              resolve();
              return;
        } else {
          this.oldParams = this.match.params;
        }
      }
      if (this.match && this.match.params) {
        const mt = this.match.params.mapType;

        if (mt === MAP_TYPE.BOOK || mt === MAP_TYPE.COMP || mt === MAP_TYPE.LOCN) {
          this.mapType = mt;
        }

        if (this.match.params.id !== undefined) {
          const re = /([A-Z]{3})(\d{2}(?=\d{2,}|$|\D*$)|\d{1})?(.*)/;
          this.paramMatches = re.exec(this.match.params.id);
        } else {
          this.paramMatches = undefined;
        }

        // Right now ref is only used for book ISBN numbers.
        if (this.match.params.ref !== undefined && this.mapType === MAP_TYPE.BOOK) {
          const ref = this.match.params.ref;
          if (ref.length === 13) {
            await loadData('books/' + ref).then((b: BookDetails) => {
              this._bookData = this.extraDetails = b;
            });
          } else {
            this._bookData = undefined;
            // Invalid record number
          }
        }
      }

      // Update enabled buildings / floors and elements according to the new
      // state.

      const blds = Object.values(this._buildingData);
      let flrs = Object.values(this._floorData);

      blds.forEach((b: Building) => {
        b.enabled = (this.mapType === MAP_TYPE.LOCN || b.code === 'LIB');
      });

      // Set the active building to the one that is enabled and matches the
      // building code, otherwise, pick the first one that is simply enabled.
      const matchedBld = blds.find((b: Building) => this.paramMatches && b.code === this.paramMatches[1]);
      this.activeBuildingId = blds.find((b: Building) =>
        b.enabled && (!matchedBld || matchedBld.id === b.id)
      ).id;

      this._building = this._buildingData[this.activeBuildingId];

      flrs = flrs.filter((f: Floor) => f.buildingId === this.activeBuildingId);
      flrs.forEach((f: Floor) => {
        f.enabled = (this.mapType === MAP_TYPE.LOCN ||
          (this.mapType === MAP_TYPE.BOOK && this.floorHasBook(f)) ||
          (this.mapType === MAP_TYPE.COMP && this.floorHasComps(f)));
      });

      let matchedFlr = flrs.find((f: Floor) => this.paramMatches && f.number === Number(this.paramMatches[2]));
      matchedFlr = flrs.find((f: Floor) =>
        f.enabled && (!matchedFlr || f.number === matchedFlr.number)
      );

      if (matchedFlr) {
        this.activeFloorId = matchedFlr.id;
      } else {
        // No floor matched.
        if (this.mapType === MAP_TYPE.BOOK) {
          // Redirect to book search page.
          console.log('Invalid book, redirect home');
          this.history.replace(`${BASE_URL}${ROUTES.HOME}`);
          resolve();
          return; // Return early.
        }
      }

      this._floor = this._building.floors[this.activeFloorId];
      this._floorplan = this._floor.floorplan;

      if (this.paramMatches && this.paramMatches[3] === '') {
        this.activeElementId = undefined;
      }

      Object.values(this._elementData).forEach((e: MapElementData) => {
        e.enabled = (this.mapType === MAP_TYPE.LOCN && e.category !== 5) ||
        (this.mapType === MAP_TYPE.COMP && (this.elementHasComps(e) || e.category === 5));

        Object.values(e.details).forEach((d: MapElementDetail) => {
          if (this.paramMatches && d.code === this.paramMatches[0] &&
            (this.mapType === MAP_TYPE.LOCN || this.mapType === MAP_TYPE.COMP) &&
            !this.activeElementId) {
            this.activeElementId = d.elementId;
          }

          if (this.mapType === MAP_TYPE.BOOK && this.elementHasBook(d)) {
            e.enabled = true;
          }
        });

        if (e.enabled && this.mapType === MAP_TYPE.BOOK && !this.activeElementId) {
          this.activeElementId = e.id;
        }

        if (e.icon && typeof e.icon === 'string') {
          fetchIMG(e.icon);
        }
      });

      this._element = this.activeElementId ? this._floor.elements[this.activeElementId] : undefined;
      if (this.mapType !== MAP_TYPE.BOOK) {
        this.extraDetails = {};
      }

      const labs = Object.values(this._compLabs);
      if (this._element !== undefined && this.mapType === MAP_TYPE.COMP && labs.length > 0) {
        // An element is selected, see if it is a lab and get the availability.
        const lab: ComputerLab | undefined = labs.find((l: ComputerLab) => this._element && l.locName === Object.values(this._element.details)[0].code);
        if (lab) {
          this.extraDetails = { available: lab.compAvail, total: lab.compTotal };
        }
      }

      /**
       * If `paramMatches` is undefined, the URL is empty and doesn't match the
       * active building/floor.  Replace the current
       */
      if (!this.paramMatches || (this.paramMatches &&
        (this.paramMatches[1] !== this._building.code ||
          Number(this.paramMatches[2]) !== this._floor.number ||
          (this.paramMatches[3] !== '' && !this.activeElementId)))) {
        // TODO: Display toast notifying user that entry was invalid or doesn't exist.
        console.log('Trying to rectify route');
        this.history.replace(`${BASE_URL}${ROUTES.MAP}/${this.mapType}/${this._building.code}${this._floor.number}`);
        resolve();
      }

      resolve();
    });
  }

  private _loadData() {
    // Load Data.
    this._buildingData = dataService.getData(APP_DATA.BUILDING);
    this._floorData = dataService.getData(APP_DATA.FLOORS);
    this._elementData = dataService.getData(APP_DATA.ELEMENTS);
    this._detailData = dataService.getData(APP_DATA.DETAILS);
    this._compLabs = {};
    let compLabs: ComputerLab[] = [];
    compLabs = dataService.getData(APP_DATA.COMPUTERS);

    // Add references to the floors for each building.
    Object.values(this._buildingData).forEach((b: Building) => {
      b.floors = Object.values(this._floorData || {}).reduce((ob: FloorMap, f: Floor) => {
        if (f.buildingId === b.id) ob[f.id] = f;
        return ob;
      }, {} as Floor);
    });

    // Add references to the elemetns of each floor.
    Object.values(this._floorData).forEach((f: Floor) => {
      f.elements = Object.values(this._elementData || {}).reduce((ob, e) => {
        if (e.floorId === f.id) ob[e.id] = e;
        return ob;
      }, {} as MapElementData);
    });

    Object.values(this._floorData).forEach((f: Floor) => {
      if (f.floorplan && f.id !== this.activeFloorId) {
        fetchIMG(f.floorplan);
      }
    });

    // Add references to the details of each element.
    Object.values(this._elementData).forEach((e: MapElementData) => {
      e.details = Object.values(this._detailData || {}).reduce((ob, d: MapElementDetail) => {
        if (d.elementId === e.id) ob[d.id] = d;

        compLabs.forEach((lab: ComputerLab) => {
          if (d.code === lab.locName) {
            this._compLabs[d.elementId] = lab;
          }
        });

        return ob;
      }, {} as MapElementDetail);

      compLabs.forEach((lab: ComputerLab) => {
        const comps = lab.comps;
        comps.forEach((comp: ComputerAvailability) => {
          if (e.name === comp.name) {
            e.available = comp.avail;
            e.clickable = false;
          }
        });
      });

      if (e.icon && typeof e.icon === 'string') {
        fetchIMG(e.icon);
      }
    });
  }

  floorHasComps(floor: Floor) {
    const labs = Object.values(this._compLabs);
    let hasComps = false;

    for (const lab of labs) {
      if (lab.locName.indexOf(this._buildingData[floor.buildingId].code) === -1) {
        hasComps = false;
        break;
      }

      if (Number(lab.locName.charAt(3)) === floor.number) {
        hasComps = true;
        break;
      }
    }

    return hasComps;
  }

  elementHasComps(el: MapElementData) {
    const labs = Object.values(this._compLabs);
    let hasComps = false;

    if (el.category === 4) {
      labs.forEach((lab: ComputerLab) => {
        Object.values(el.details).forEach((d: MapElementDetail) => {
          if (lab.locName === d.code) {
            hasComps = true;
          }
        });
      });
    }

    return hasComps;
  }

  floorHasBook(floor: Floor) {
    let hasBook = false;

    if (this._bookData) {
      this._bookData.availability.map((a: BookAvailability) => {
        hasBook = a.location === floor.name;
      });
    }

    return hasBook;
  }

  elementHasBook(det: MapElementDetail) {
    let hasBook = false;

    if (this._bookData) {
      this._bookData.availability.map((a: BookAvailability) => {
        hasBook = a.shelf === det.code;
      });
    }

    return hasBook;
  }

  render() {
    const { _buildingData, _building, loaded, _element, extraDetails } = this;
    const detail: MapElementDetail = _element && Object.values(_element.details)[0];

    if (loaded && _buildingData && _building) {
      const { _floorplan } = this;
      const subtitle = this.activeElementId ? detail.code : `${_building.code}${this._floor.number}`;

      return (
        <Host class={{ 'rl-view': true, 'rl-view--map': true, 'rl-view--loaded': this.loaded && this.appLoaded }}>
          <stencil-route-title pageTitle={`${subtitle} | Directory`} />
          <rl-map
            class="rl-map"
            elements={this._floor.elements}
            mapImage={_floorplan}
            onElementSelected={e => {
              const elCode = Object.values(e.detail.details as MapElementDetailMap)[0].code;
              let route = `${BASE_URL}${ROUTES.MAP}/${this.mapType}/${elCode}`;
              route = this._bookData ? `${route}/${this._bookData.iSBN[0]}` : route;

              this.history.push(route);
            }}
            onElementDeselected={() => {
              if (!this._bookData) {
                this.history.push(`/${ROUTES.MAP}/${this.mapType}/${this._building.code}${this._floor.number}`);
              }
            }}
            activeElementId={this.activeElementId}
          >
          </rl-map>

          <rl-side-sheet open={this.activeElementId !== undefined}>
            <header class="rl-side-sheet__header">
              <span class="rl-side-sheet__title">
                <div class="mdc-typography--body2">{detail && detail.code || ''}</div>
                <div class="mdc-typography--headline6">{detail && detail.name || ''}</div>
              </span>
              <button
                class="material-icons rl-side-sheet__close"
                aria-label="Close detail panel."
                tabindex={_element ? '0' : '-1'}>
                close
              </button>
            </header>
            <div class="rl-side-sheet__content">
              <div class="rl-side-sheet__section">
                <div class="rl-side-sheet__subtitle mdc-typography--subtitle2">Description</div>
                {detail && detail.description || ''}
              </div>
              {extraDetails && Object.entries(extraDetails).map(item =>
                <div class="rl-side-sheet__section">
                  <div class="rl-side-sheet__subtitle mdc-typography--subtitle2">{item[0].charAt(0).toUpperCase() + item[0].slice(1)}</div>
                  {typeof item[1] === 'boolean' ? item[1] ? 'Yes' : 'No' : item[1]}
                </div>
              )}
            </div>
          </rl-side-sheet>

          <rl-map-nav
            activeBuildingId={this.activeBuildingId}
            activeFloorId={this.activeFloorId}
            buildings={this._buildingData}
            floors={_building.floors}
            onBuildingChanged={ev => this.history.push(`/${ROUTES.MAP}/${this.mapType}/${ev.detail}`)}
            onFloorChanged={ev => this.history.push(`/${ROUTES.MAP}/${this.mapType}/${this._building.code}${ev.detail}`)}
          >
          </rl-map-nav>
        </Host>
      );
    }

    return (
      <Host class={{ 'rl-view': true, 'rl-view--map': true, 'rl-view--loaded': this.loaded && this.appLoaded }}>
        <div>Loading...</div>
      </Host>
    );
  }
}
