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
  MAP_TYPE,
  ROUTES,
} from '../../global/constants';
import {
  BookAvailability,
  BookDetails,
  Building,
  ComputerLab,
  Floor,
  MapElement,
} from '../../interface';
// import { dataService } from '../../utils/data-service';
import { dataStore } from '../../utils/app-data';
import { loadData } from '../../utils/load-data';
// import { dataStore } from '../../utils/app-data';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  private _buildingData!: Building[];
  private _floorData!: Floor[];
  private _detailData!: MapElement[];
  private _bookData?: BookDetails;
  private _compLabs!: ComputerLab[];

  private extraDetails: {} = {};

  private oldParams: { [key: string]: string } = {};
  /**
   * Any URL matches for determining pre-selected building, floor and element.
   */
  private paramMatches?: string[];

  @State() computerAvailability = {};

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
  private activeElement?: MapElement;

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
    return this._loadData().then(_ => {
      return this._parseParameters();
    });

    // return this._parseParameters();
    // this.loaded = true;
  }

  componentDidLoad() {
    this.checkSize();
  }

  componentWillUpdate() {
    return this._parseParameters();
  }

  componentDidUpdate() {
    this.computerAvailability = {};
    const cLabs = this.floorComputerLabs(this.activeFloor);
    if (cLabs !== undefined) {
      cLabs.forEach(l => {
        const comps = l.computers;
        if (comps !== undefined) {
          comps.forEach(av => {
            this.computerAvailability[av.name] = {
              fill: av.available ? 'green' : 'red',
            };
          });
        }
      });
    }
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
    // provided.  Must be in the form BLD[-FLR][-RM].
    // Where BLD is the three letter building code, FLR is the floor number,
    // and RM is the 'room number'.  The `room number` is actually the full
    // location code (e.g. SLC508)
    return new Promise(async resolve => {
      // Check if parameters have changed.
      // if (this.match.params) {
      if (this.oldParams.mapType === this.match.params.mapType &&
          this.oldParams.id === this.match.params.id &&
          this.oldParams.ref === this.match.params.ref) {
            // Parameters unchanged, no need to process further.
            resolve();
            return;
      } else {
        this.oldParams = this.match.params;
      }
      // }
      // if (this.match && this.match.params) {
      const mt = this.match.params.mapType;

      if (mt === MAP_TYPE.BOOK || mt === MAP_TYPE.COMP || mt === MAP_TYPE.LOCN) {
        this.mapType = mt;
      }

      this.paramMatches = this.match.params.id !== undefined ? this.match.params.id.split('-') : undefined;

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
      // }

      // Update enabled buildings / floors and elements according to the new
      // state.

      const blds = this._buildingData;
      let flrs = this._floorData;

      blds.forEach((b: Building) => {
        b.enabled = (this.mapType === MAP_TYPE.LOCN || b.code === 'LIB');
      });

      // Set the active building to the one that is enabled and matches the
      // building code, otherwise, pick the first one that is simply enabled.
      const matchedBld = blds.find((b: Building) => this.paramMatches && b.code === this.paramMatches[0]);
      this.activeBuilding = matchedBld ? matchedBld : blds[0];

      flrs = flrs.filter((f: Floor) => f.building === this.activeBuilding.code);
      flrs.forEach((f: Floor) => {
        f.enabled = (this.mapType === MAP_TYPE.LOCN ||
          (this.mapType === MAP_TYPE.BOOK && this.floorHasBook(f)) ||
          (this.mapType === MAP_TYPE.COMP && this.floorHasComps(f)));
      });

      let matchedFlr = flrs.find((f: Floor) => this.paramMatches && f.code === `${this.paramMatches[0]}-${this.paramMatches[1]}`);
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

      if (this.paramMatches && this.paramMatches.length < 3) {
        this.activeElement = undefined;
      }

      this._detailData.forEach((e: MapElement) => {
        // e.enabled = (this.mapType === MAP_TYPE.LOCN && e.category !== 5) ||
        if (this.paramMatches && e.code === this.paramMatches.join('-') &&
          (this.mapType === MAP_TYPE.LOCN || this.mapType === MAP_TYPE.COMP)) {
          this.activeElement = e;
        }
        // if (e.enabled && this.mapType === MAP_TYPE.BOOK && !this.activeElement) {
        //   this.activeElement = e;
        // }
      });

      if (this.mapType !== MAP_TYPE.BOOK) {
        this.extraDetails = {};
      }

      const labs = Object.values(this._compLabs);
      if (this.activeElement !== undefined && this.mapType === MAP_TYPE.COMP && labs.length > 0) {
        // An element is selected, see if it is a lab and get the availability.
        const lab: ComputerLab | undefined = labs.find((l: ComputerLab) => this.activeElement && this.activeElement.code === l.code);
        if (lab) {
          this.extraDetails = { available: lab.computerAvailable, total: lab.computerTotal };
        }
      }

      /**
       * If `paramMatches` is undefined, the URL is empty and doesn't match the
       * active building/floor.  Replace the current
       */
      // if (!this.paramMatches || (this.paramMatches &&
      //   (this.paramMatches[0] !== this.activeBuilding.code ||
      //     (this.paramMatches.slice(0, 2).join('-')) !== this.activeFloor.code ||
      //     (this.paramMatches.join('-') !== '' && !this.activeElement)))) {
      //   // TODO: Display toast notifying user that entry was invalid or doesn't exist.
      //   console.log('Trying to rectify route');
      //   this.history.replace(`${BASE_URL}${ROUTES.MAP}/${this.mapType}/${this.activeFloor.code}`);
      //   resolve();
      // }

      resolve();
    });
  }

  private _loadData() {
    return new Promise((res, rej) => {
      Promise.all([
        dataStore.getData('buildings'),
        dataStore.getData('floors'),
        dataStore.getData('details'),
        dataStore.getData('computers'),
      ]).then(results => {
        this._buildingData = results[0];
        this._floorData = results[1];
        this._detailData = results[2];
        const compLabs = results[3];
        this._compLabs = [];

        this._buildingData.forEach((b: Building) => {
          b.floors = (this._floorData || []).filter((f: Floor) => {
            return f.building === b.code;
          });
        });

        // Add references to the elemetns of each floor.
        this._floorData.forEach((f: Floor) => {
          f.details = (this._detailData || []).filter((d: MapElement) => {
            return d.floor === f.code;
          });
        });

        this._detailData.forEach((d: MapElement) => {
          compLabs.forEach((lab: ComputerLab) => {
            if (d.code === lab.code) {
              this._compLabs.push(lab);
            }
          });
        });

        res();
      }).catch(e => {
        console.error('Error loading view-map data ' + e);
        rej();
      });
    });

    // Load Data.
    // this._buildingData = dataService.getData(APP_DATA.BUILDING);
    // this._floorData = dataService.getData(APP_DATA.FLOORS);
    // // this._elementData = dataService.getData(APP_DATA.ELEMENTS);
    // this._detailData = dataService.getData(APP_DATA.DETAILS);
    // this._compLabs = [];
    // let compLabs: ComputerLab[] = [];
    // compLabs = dataService.getData(APP_DATA.COMPUTERS);

    // // Add references to the floors for each building.
    // this._buildingData.forEach((b: Building) => {
    //   b.floors = (this._floorData || []).filter((f: Floor) => {
    //     return f.building === b.code;
    //   });
    // });

    // // Add references to the elemetns of each floor.
    // this._floorData.forEach((f: Floor) => {
    //   f.details = (this._detailData || []).filter((d: MapElement) => {
    //     return d.floor === f.code;
    //   });
    // });

    // this._detailData.forEach((d: MapElement) => {
    //   compLabs.forEach((lab: ComputerLab) => {
    //     if (d.code === lab.code) {
    //       this._compLabs.push(lab);
    //     }
    //   });
    // });
  }

  floorComputerLabs(floor?: Floor) {
    if (floor === undefined) return;
    return this._compLabs.filter((lab: ComputerLab) => {
      return lab.code.substr(0, 6) === floor.code;
    });
  }

  floorHasComps(floor: Floor) {
    return this._compLabs.filter((lab: ComputerLab) => {
      return lab.code.substr(0, 6) === floor.code;
    }).length > 0;
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

  elementHasBook(det: MapElement) {
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
    const detail = activeElement && activeElement;
    const pageTitle =
      this.mapType === MAP_TYPE.COMP ? 'Computer Labs' :
      this.mapType === MAP_TYPE.BOOK ? 'Books' : 'Directory';

    if (loaded && _buildingData && activeBuilding && activeFloor) {
      const subtitle = detail ? detail.code : `${this.activeFloor.name}, ${activeBuilding.name}`;

      return (
        <Host class={{ 'rl-view': true, 'rl-view--map': true, 'rl-view--loaded': this.loaded && this.appLoaded }}>
          <stencil-route-title pageTitle={`${subtitle} | ${pageTitle} | `} />
          <rl-pan-zoom class="rl-pan-zoom" scaled>
            <rl-floorplan
              useOrtho={true}
              floorId={activeFloor.code}
              slot="pz-content"
              activeId={activeElement !== undefined ? activeElement.code : ''}
              onRlElementClicked={e => {
                const elCode = e.detail;
                let route = `${BASE_URL}${ROUTES.MAP}/${this.mapType}/${elCode}`;
                route = this._bookData ? `${route}/${this._bookData.iSBN[0]}` : route;

                this.history.push(route);
              }}
              onRlElementCleared={() => {
                this.activeElement = undefined;
                this.history.push(`/${ROUTES.MAP}/${this.mapType}/${activeFloor.code}`);
              }}
              extraElementData={this.computerAvailability}
            >
            </rl-floorplan>
          </rl-pan-zoom>

          <rl-side-sheet open={activeElement !== undefined}>
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
            activeFloor={activeFloor}
            buildings={_buildingData}
            floors={activeBuilding.floors}
            onBuildingChanged={ev => this.history.push(`/${ROUTES.MAP}/${this.mapType}/${ev.detail}`)}
            onFloorChanged={ev => this.history.push(`/${ROUTES.MAP}/${this.mapType}/${ev.detail}`)}
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
