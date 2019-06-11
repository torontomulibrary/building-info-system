import {
  Component,
  Element,
  Event,
  EventEmitter,
  // Method,
  Prop,
  State,
  h,
} from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { MatchResults, RouterHistory } from '@stencil/router';

// import { BASE_URL } from '../../global/config';
import {
  APP_DATA,
  MAP_TYPE,
  // ROUTES,
} from '../../global/constants';
import {
  BookDetails,
  Building,
  BuildingMap,
  // ComputerAvailability,
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
import { compareLCCN } from '../../utils/lccn';
import { loadData } from '../../utils/load-data';
// import { MAP_TYPE } from '../../global/constants';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  private _buildingData!: BuildingMap;
  private _floorData!: FloorMap;
  private _elementData!: MapElementDataMap;
  private _detailData!: MapElementDetailMap;
  private _bookData!: BookDetails;
  private _compLabs!: ComputerLabMap;

  /**
   * Any URL matches for determining pre-selected building, floor and element.
   */
  private paramMatches: RegExpExecArray | null | undefined;

  private initialBuilding = -1;

  private initialFloor = -1;

  private initialElement?: number;

  // private _mapContainer!: HTMLRlMapContainerElement;

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

  @State() buildings?: BuildingMap;

  @State() extraDetails: {} = {};

  /**
   * A global flag passed in to indicate if the application has loaded as well.
   */
  @Prop() appLoaded = false;

  private mapType: MAP_TYPE = MAP_TYPE.LOCN;

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

  async componentWillLoad() {
    this._loadData();
    await this._parseParameters();

    this.loaded = true;
    this.buildings = this._buildingData;
  }

  componentDidLoad() {
    this.checkSize();
  }

  componentWillUpdate() {
    this._parseParameters();
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

  private async _parseParameters() {
// Check the URL value to see if any Building, Floor and or Location was
    // provided.  Must be in the form BLD[FLR][RM].
    // Where BLD is the three letter building code, FLR is the floor number,
    // and RM is the 'room number'.  The `room number` is actually the full
    // location code (e.g. SLC508)
    if (this.match && this.match.params) {
      const mt = this.match.params.mapType;

      if (mt === MAP_TYPE.BOOK || mt === MAP_TYPE.COMP || mt === MAP_TYPE.LOCN) {
        this.mapType = mt;
      }

      if (this.match.params.id !== undefined) {
        const id = this.match.params.id;
        const re = /([A-Z]{3})(\d{2}(?=\d{2,}|$|\D*$)|\d{1})?.*/;

        switch (this.mapType) {
          case MAP_TYPE.BOOK:
            // In this case, id should be a book record number.
            if (id.charAt(0) === 'b') {
              await loadData('books/' + id).then((b: BookDetails) => {
                this._bookData = this.extraDetails = b;
              });
            } else {
              // Invalid record number
            }
            break;
          case MAP_TYPE.COMP:
          case MAP_TYPE.LOCN:
            this.paramMatches = re.exec(id);
            break;
          default:
        }
      }
    }

    // Update enabled buildings / floors and elements according to the new
    // state.

    Object.values(this._buildingData).forEach((b: Building) => {
      b.enabled = (this.mapType === MAP_TYPE.LOCN || b.code === 'LIB');

      // Set the initial building to the first or the one specified in the URL.
      if (b.enabled && (this.initialBuilding === -1) ||
          (this.paramMatches && this.paramMatches[1] && b.code === this.paramMatches[1])) {
        this.initialBuilding = b.id;
      }
    });

    Object.values(this._floorData).forEach((f: Floor) => {
      f.enabled = (this.mapType === MAP_TYPE.LOCN ||
          (this.mapType === MAP_TYPE.BOOK && this._bookData && this._bookData.locations.indexOf(f.name) !== -1)) ||
          (this.mapType === MAP_TYPE.COMP && this.floorHasComps(f));

      // Set the initial floor to the specified floor, or first floor of the
      // initial building.
      if (f.enabled && f.buildingId === this.initialBuilding && (this.initialFloor === -1 ||
          this.paramMatches && this.paramMatches[2] && f.number === Number(this.paramMatches[2]))) {
        this.initialFloor = f.id;
      }
    });

    Object.values(this._elementData).forEach((e: MapElementData) => {
      e.details = Object.values(this._detailData || {}).reduce((ob, d: MapElementDetail) => {
        if (this.paramMatches && d.code === this.paramMatches[0] &&
            (this.mapType === MAP_TYPE.LOCN || this.mapType === MAP_TYPE.COMP) &&
            !this.initialElement) {
          this.initialElement = d.elementId;
        }
        if (d.elementId === e.id) ob[d.id] = d;
        return ob;
      }, {} as MapElementDetail);

      e.enabled = ((this.mapType === MAP_TYPE.LOCN && e.category !== 5) ||
          (this.mapType === MAP_TYPE.BOOK && this._bookData &&
          this.bookOnShelf(this._bookData.callNo, e)) ||
          (this.mapType === MAP_TYPE.COMP && (this.elementHasComps(e) || e.category === 5))) ?
          true : false;

      if (e.enabled && this.mapType === MAP_TYPE.BOOK && !this.initialElement) {
        this.initialElement = e.id;
      }

      if (e.icon && typeof e.icon === 'string') {
        fetchIMG(e.icon);
      }
    });

    // if (this.mapType === MAP_TYPE.COMP && compLabs.length > 0) {
    //   this._compLabs = {};
    //   compLabs.forEach((l: ComputerLab) => {
    //     Object.values(this._detailData).forEach((d: MapElementDetail) => {
    //       if (d.code === l.locName) {
    //         this._compLabs[d.elementId] = l;
    //         this.extraDetails[d.code] = { available: l.compAvail, total: l.compTotal };
    //         const comps = l.comps;
    //         comps.forEach((c: ComputerAvailability) => {
    //           Object.values(this._elementData).forEach((e: MapElementData) => {
    //             if (e.name === c.name) {
    //               e.available = c.avail;
    //               e.clickable = false;
    //             }
    //           });
    //         });
    //       }
    //     });
    //   });
    // }
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

    // Load floorplan images, starting with the image for the initial floor.
    // fetchIMG(this._floorData[this.initialFloor].floorplan);

    Object.values(this._floorData).forEach((f: Floor) => {
      if (f.floorplan && f.id !== this.initialFloor) {
        fetchIMG(f.floorplan);
      }
    });

    // Add references to the details of each element.
    Object.values(this._elementData).forEach((e: MapElementData) => {
      e.details = Object.values(this._detailData || {}).reduce((ob, d: MapElementDetail) => {
        if (this.paramMatches && d.code === this.paramMatches[0] &&
            (this.mapType === MAP_TYPE.LOCN || this.mapType === MAP_TYPE.COMP) &&
            !this.initialElement) {
          this.initialElement = d.elementId;
        }

        if (d.elementId === e.id) ob[d.id] = d;

        compLabs.forEach((lab: ComputerLab) => {
          if (d.code === lab.locName) {
            this._compLabs[d.elementId] = lab;
          }
        });

        return ob;
      }, {} as MapElementDetail);

      if (e.icon && typeof e.icon === 'string') {
        fetchIMG(e.icon);
      }
    });

    // if (this.mapType === MAP_TYPE.COMP && compLabs.length > 0) {
    //   this._compLabs = {};
    //   compLabs.forEach((l: ComputerLab) => {
    //     Object.values(this._detailData).forEach((d: MapElementDetail) => {
    //       if (d.code === l.locName) {
    //         this._compLabs[d.elementId] = l;
    //         this.extraDetails[d.code] = { available: l.compAvail, total: l.compTotal };
    //         const comps = l.comps;
    //         comps.forEach((c: ComputerAvailability) => {
    //           Object.values(this._elementData).forEach((e: MapElementData) => {
    //             if (e.name === c.name) {
    //               e.available = c.avail;
    //               e.clickable = false;
    //             }
    //           });
    //         });
    //       }
    //     });
    //   });
    // }
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

  bookOnShelf(callNo: string, shelf: MapElementData) {
    let found = false;
    if (shelf.details) {
      Object.values(shelf.details).forEach((d: MapElementDetail) => {
        const startCompare = compareLCCN(d.callStart, callNo);
        const endCompare = compareLCCN(callNo, d.callEnd);
        if (startCompare && startCompare >= 0 && endCompare && endCompare >= 0) {
          found = true;
        }
      });
    }

    return found;
  }

  hostData() {
    return {
      class: {
        'rl-view': true,
        'rl-view--map': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    if (this.loaded && this.buildings) {
      return ([
        <stencil-route-title pageTitle="Directory" />,
        <rl-map-container
          buildings={this.buildings}
          initialBuilding={this.initialBuilding}
          initialFloor={this.initialFloor}
          initialElement={this.initialElement}
          extraDetails={this.extraDetails}>
        </rl-map-container>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
