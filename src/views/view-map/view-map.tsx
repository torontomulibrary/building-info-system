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
  // BuildingMap,
  ComputerAvailability,
  ComputerLab,
  // ComputerLabMap,
  Floor,
  // FloorMap,
  MapElementData,
  // MapElementDataMap,
  MapElementDetail,
  // MapElementDetailMap,
} from '../../interface';
import { dataService } from '../../utils/data-service';
import { fetchIMG } from '../../utils/fetch';
import { loadData } from '../../utils/load-data';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  private _buildingData!: Building[];
  private _floorData!: Floor[];
  private _elementData!: MapElementData[];
  private _detailData!: MapElementDetail[];
  private _bookData?: BookDetails;
  private _compLabs!: ComputerLab[];

  // private _building!: Building;
  // private _element?: MapElementData;
  // private _floor!: Floor;
  // private _floorplan = '';

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

  private activeBuilding!: Building;
  private activeFloor!: Floor;
  private activeElement?: MapElementData;

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

      const blds = this._buildingData;
      let flrs = this._floorData;

      blds.forEach((b: Building) => {
        b.enabled = (this.mapType === MAP_TYPE.LOCN || b.code === 'LIB');
      });

      // Set the active building to the one that is enabled and matches the
      // building code, otherwise, pick the first one that is simply enabled.
      const matchedBld = blds.find((b: Building) => this.paramMatches && b.code === this.paramMatches[1]);
      this.activeBuilding = matchedBld ? matchedBld : blds[0];
      // this.activeBuilding = blds.find((b: Building) =>
      //   b.enabled && (!matchedBld || matchedBld.id === b.id)
      // ).id;

      // this._building = this._buildingData[this.activeBuilding];

      flrs = flrs.filter((f: Floor) => f.building === this.activeBuilding.code);
      flrs.forEach((f: Floor) => {
        f.enabled = (this.mapType === MAP_TYPE.LOCN ||
          (this.mapType === MAP_TYPE.BOOK && this.floorHasBook(f)) ||
          (this.mapType === MAP_TYPE.COMP && this.floorHasComps(f)));
      });

      let matchedFlr = flrs.find((f: Floor) => this.paramMatches && f.code === (this.paramMatches[1] + this.paramMatches[2]));
      matchedFlr = flrs.find((f: Floor) =>
        f.enabled && (!matchedFlr || f.code === matchedFlr.code)
      );

      if (matchedFlr) {
        this.activeFloor = matchedFlr;
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

      if (this.paramMatches && this.paramMatches[3] === '') {
        this.activeElement = undefined;
      }

      this._elementData.forEach((e: MapElementData) => {
        // e.enabled = (this.mapType === MAP_TYPE.LOCN && e.category !== 5) ||
        // (this.mapType === MAP_TYPE.COMP && (this.elementHasComps(e) || e.category === 5));

        e.details.forEach((d: MapElementDetail) => {
          e.enabled =
            (this.mapType === MAP_TYPE.LOCN && d.category !== 'comp') ||
            (this.mapType === MAP_TYPE.COMP && (d.category === 'lab' || d.category === 'comp')) ||
            (this.mapType === MAP_TYPE.BOOK && d.category === 'stack' && this.elementHasBook(d));

          if (this.paramMatches && d.code === this.paramMatches[0] &&
            (this.mapType === MAP_TYPE.LOCN || this.mapType === MAP_TYPE.COMP)) {
            this.activeElement = e;
          }

          // if (this.mapType === MAP_TYPE.BOOK && this.elementHasBook(d)) {
          //   e.enabled = true;
          // }
        });

        if (e.enabled && this.mapType === MAP_TYPE.BOOK && !this.activeElement) {
          this.activeElement = e;
        }

        if (e.icon !== undefined && e.icon !== null) {
          fetchIMG(e.icon).catch(reason => console.error(`Failed to load icon. [${reason}]`));
        }
      });

      // this._element = this.activeElement ? this._floor.elements[this.activeElement] : undefined;
      if (this.mapType !== MAP_TYPE.BOOK) {
        this.extraDetails = {};
      }

      const labs = Object.values(this._compLabs);
      if (this.activeElement !== undefined && this.mapType === MAP_TYPE.COMP && labs.length > 0) {
        // An element is selected, see if it is a lab and get the availability.
        const lab: ComputerLab | undefined = labs.find((l: ComputerLab) => this.activeElement && this.activeElement.id === l.elementId);
        if (lab) {
          this.extraDetails = { available: lab.computerAvailable, total: lab.computerTotal };
        }
      }

      /**
       * If `paramMatches` is undefined, the URL is empty and doesn't match the
       * active building/floor.  Replace the current
       */
      if (!this.paramMatches || (this.paramMatches &&
        (this.paramMatches[1] !== this.activeBuilding.code ||
          (this.paramMatches[1] + this.paramMatches[2]) !== this.activeFloor.code ||
          (this.paramMatches[3] !== '' && !this.activeElement)))) {
        // TODO: Display toast notifying user that entry was invalid or doesn't exist.
        console.log('Trying to rectify route');
        this.history.replace(`${BASE_URL}${ROUTES.MAP}/${this.mapType}/${this.activeBuilding.code}${this.activeFloor.number}`);
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
    this._compLabs = [];
    let compLabs: ComputerLab[] = [];
    compLabs = dataService.getData(APP_DATA.COMPUTERS);

    // Add references to the floors for each building.
    this._buildingData.forEach((b: Building) => {
      b.floors = (this._floorData || []).filter((f: Floor) => {
        return f.building === b.code;
      });
    });

    // Add references to the elemetns of each floor.
    this._floorData.forEach((f: Floor) => {
      f.elements = (this._elementData || []).filter((e: MapElementData) => {
        return e.floor === f.code;
      }, {} as MapElementData);
      fetchIMG(f.floorplan).catch(reason => console.error(`Failed to load floorplan. [${reason}]`));
    });

    // this._floorData.forEach((f: Floor) => {
    //   if (f.floorplan && f.id !== this.activeFloor) {
    //     fetchIMG(f.floorplan);
    //   }
    // });

    // Add references to the details of each element.
    this._elementData.forEach((e: MapElementData) => {
      e.details = (this._detailData || []).filter((d: MapElementDetail) => {
        return d.elementId === e.id;
      });

      compLabs.forEach((lab: ComputerLab) => {
        const comps = lab.computers;
        if (comps !== undefined) {
          comps.forEach((comp: ComputerAvailability) => {
            if (e.name === comp.name) {
              e.alt = comp.available;
              e.clickable = false;
            }
          });
        }
      });

      if (typeof e.icon === 'string') {
        fetchIMG(e.icon).catch(reason => console.error(`Failed to load icon. [${reason}]`));
      }
    });

    this._detailData.forEach((d: MapElementDetail) => {
      compLabs.forEach((lab: ComputerLab) => {
        if (d.code === lab.code) {
          this._compLabs.push(lab);
        }
      });
    });
  }

  floorHasComps(floor: Floor) {
    return this._compLabs.filter((lab: ComputerLab) => {
      return lab.floor === floor.code;
    }).length > 0;
  }

  elementHasComps(el: MapElementData) {
    const labs = Object.values(this._compLabs);
    let hasComps = false;

    if (el.category === 4) {
      labs.forEach((lab: ComputerLab) => {
        Object.values(el.details).forEach((d: MapElementDetail) => {
          if (lab.code === d.code) {
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
    const { _buildingData, activeBuilding, activeFloor, loaded, activeElement, extraDetails } = this;
    const detail = activeElement && activeElement.details[0];
    const pageTitle =
      this.mapType === MAP_TYPE.COMP ? 'Computer Labs' :
      this.mapType === MAP_TYPE.BOOK ? 'Books' : 'Directory';

    if (loaded && _buildingData && activeBuilding && activeFloor) {
      const floorplan = activeFloor.floorplan;
      const subtitle = detail ? detail.code : `${this.activeFloor.name}, ${activeBuilding.name}`;

      return (
        <Host class={{ 'rl-view': true, 'rl-view--map': true, 'rl-view--loaded': this.loaded && this.appLoaded }}>
          <stencil-route-title pageTitle={`${subtitle} | ${pageTitle} | `} />
          <rl-map
            class="rl-map"
            elements={this.activeFloor.elements}
            mapImage={floorplan}
            onElementSelected={e => {
              const elCode = (e.detail.details as MapElementDetail[])[0].code;
              let route = `${BASE_URL}${ROUTES.MAP}/${this.mapType}/${elCode}`;
              route = this._bookData ? `${route}/${this._bookData.iSBN[0]}` : route;

              this.history.push(route);
            }}
            onElementDeselected={() => {
              if (!this._bookData) {
                this.history.push(`/${ROUTES.MAP}/${this.mapType}/${activeBuilding.code}${activeFloor.number}`);
              }
            }}
            activeElementId={this.activeElement !== undefined && this.activeElement.id}
          >
          </rl-map>

          <rl-side-sheet open={this.activeElement !== undefined}>
            <header class="rl-side-sheet__header">
              <span class="rl-side-sheet__title">
                <div class="mdc-typography--body2">{detail && detail.code || ''}</div>
                <div class="mdc-typography--headline6">{detail && detail.name || ''}</div>
              </span>
              <button
                class="material-icons rl-side-sheet__close"
                aria-label="Close detail panel."
                tabindex={activeElement ? '0' : '-1'}>
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
            activeBuilding={activeBuilding}
            activeFloor={this.activeFloor}
            buildings={this._buildingData}
            floors={activeBuilding.floors}
            onBuildingChanged={ev => this.history.push(`/${ROUTES.MAP}/${this.mapType}/${ev.detail}`)}
            onFloorChanged={ev => this.history.push(`/${ROUTES.MAP}/${this.mapType}/${activeBuilding.code}${ev.detail}`)}
          >
          </rl-map-nav>
        </Host>
      );
    }

    return (
      <Host class={{ 'rl-view': true, 'rl-view--map': true, 'rl-view--loaded': this.loaded && this.appLoaded }}>
        <stencil-route-title pageTitle={`${pageTitle} | `} />
        <div>Loading...</div>
      </Host>
    );
  }
}
