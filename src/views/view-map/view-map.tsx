import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { MatchResults } from '@stencil/router';

import {
  AppData,
  BookDetails,
  Building,
  BuildingMap,
  Floor,
  FloorMap,
  MapElement,
  MapElementDetail,
  MapElementDetailMap,
  MapElementMap,
} from '../../interface';

import { fetchIMG, fetchJSON } from '../../utils/fetch';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  /**
   * Internal reference to the `rula-map` component element.
   */
  private mapEl!: HTMLRulaMapElement;

  /**
   * Any URL matches for determining pre-selected building, floor and element.
   */
  private paramMatches: RegExpExecArray | null | undefined;

  private sideSheet_!: HTMLRulaSideSheetElement;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

  @State() loaded = false;

  /**
   * The currently active Building.
   */
  @State() activeBuilding!: Building;

  /**
   * The currently active MapElement.
   */
  @State() activeElement?: MapElement;

  /**
   * The currently active Floor.
   */
  @State() activeFloor!: Floor;

  /**
   * Reference to the floorplan image currently being displayed.
   */
  @State() activeFloorplan!: HTMLImageElement;

  /**
   * A list of all the floors of the current Building.
   */
  @State() activeFloors!: FloorMap;

  @Prop() bookDetails?: BookDetails;
  @Watch('bookDetails')
  onBookDetailsChange() {
    // console.log(this.bookDetails);
  }

  /**
   * A list of all the Elements currently displayed on the Map.
   */
  @State() activeElements!: MapElementMap;

  @Prop({ mutable: true }) appData!: AppData;

  @Prop() appLoaded = false;

  /**
   * A string matched from the URL that should be used to pre-select a specific
   * building, building and floor, or building, floor and element.
   */
  @State() query = '';

  /**
   * The results coming from `stencil-router` that contain any URL matches.
   */
  @Prop() match!: MatchResults;

  @Event() dataLoaded!: EventEmitter;

  componentWillLoad() {
    // Check the URL value to see if any Building, Floor and or Location was
    // provided.  Must be in the form BLD[FLR][RM].
    // Where BLD is the three letter building code, FLR is the floor number,
    // and RM is the 'room number'.  The `room number` is actually the full
    // location code (e.g. SLC508)
    if (this.match && this.match.params) {
      if (this.match.params.roomNo) {
        const query = this.match.params.roomNo;
        const re = /([A-Z]{3})(\d{2}(?=.{2,}|$)|\d{1})?.*/;
        this.paramMatches = re.exec(query);
      } else {
        this.paramMatches = undefined;
      }

      if (this.match.params.callNo) {
        const query = this.match.params.callNo;
        if (query.charAt(0) === 'b') {
          // Have a book record number.
          fetchJSON(this.appData.apiUrl + 'books/' + query).then((details: BookDetails) => {
            this.appData = { ...this.appData, bookDetails: details };
          });
        } else {
          // Invalid record number.
        }
      }
    }

    if (this.appData) {
      const dataPromises: Array<Promise<any>> = [];

      if (!this.appData.buildings) {
        dataPromises.push(fetchJSON(this.appData.apiUrl + 'buildings').then(
            (buildings: BuildingMap) => {
          this.appData = { ...this.appData, buildings };
        }));
      }

      if (!this.appData.floors) {
        // Load floors.
        dataPromises.push(fetchJSON(this.appData.apiUrl + 'floors').then(
            (floors: FloorMap) => {
          this.appData = { ...this.appData, floors };
        }));
      }

      if (!this.appData.elements) {
        // Load elements.
        dataPromises.push(fetchJSON(this.appData.apiUrl + 'elements').then(
            (elements: MapElementMap) => {
          this.appData = { ...this.appData, elements };
        }));
      }

      if (!this.appData.details) {
        // Load details.
        dataPromises.push(fetchJSON(this.appData.apiUrl + 'details').then(
            (details: MapElementDetailMap) => {
          this.appData = { ...this.appData, details };
        }));
      }

      Promise.all(dataPromises).then(() => this._parseMapData());
    }
  }

  onElementSelected(detail: any) {
    this._setActiveElement(detail);
    // this.activeElement = { ...detail };
  }

  onElementDeselected() {
    this._setActiveElement();
    // this.activeElement = undefined;
  }

  @Method()
  setActiveElementByDetail(detailId: number) {
    // Perform a lookup to see which Element the detail belongs to, which floor
    // the Element is on and which Building the floor is in.
    // Then change the building, floor and element to match.
    const dt = this.appData.details && this.appData.details[detailId];
    const el = dt && this.appData.elements && this.appData.elements[dt.elementId];
    const fl = el && this.appData.floors && this.appData.floors[el.floorId];
    const bl = fl && this.appData.buildings && this.appData.buildings[fl.buildingId];

    if (bl && fl && el) {
      this._setActiveBuilding(bl);
      this._setActiveFloor(fl);
      this._setActiveElement(el);
    }
  }

  @Listen('mapNavBuildingChanged')
  _onMapNavBuildingChanged(e: CustomEvent) {
    this._onBuildingChanged(e.detail);
  }

  @Listen('mapNavFloorChanged')
  _onMapNavFloorChanged(e: CustomEvent) {
    this._onFloorChanged(e.detail);
  }

  _parseMapData() {
    const blds = this.appData.buildings;
    const flrs = this.appData.floors;
    const elms = this.appData.elements;
    const dtls = this.appData.details;

    const dataPromises: Array<Promise<any>> = [];

    if (blds && flrs && elms && dtls) {
      // Add references to the floors of each building.
      Object.values(blds).forEach((b: Building) => {
        b.floors = Object.values(flrs || {}).reduce((ob: FloorMap, f: Floor) => {
          if (f.buildingId === b.id) ob[f.id] = f;
          return ob;
        }, {} as Floor);
      });

      Object.values(flrs).forEach((f: Floor) => {
        f.elements = Object.values(elms || {}).reduce((ob, e) => {
          if (e.floorId === f.id) ob[e.id] = e;
          return ob;
        }, {} as MapElement);
      });

      Object.values(flrs).forEach((f: Floor) => {
        // Once the floorplan is loaded, the url will be `blob:http...`
        // so check if the floorplan starts with the `h` of http.
        if (f.floorplan && f.floorplan.charAt(0) === 'h') {
          dataPromises.push(fetchIMG(f.floorplan).then(img => {
            // Store the blob source when loaded.
            f.floorplan = img;
          }));
        }
      });

      Object.values(elms).forEach((e: MapElement) => {
        e.details = Object.values(dtls || {}).reduce((ob, d) => {
          if (d.elementId === e.id) ob[d.id] = d;
          return ob;
        }, {} as MapElementDetail);

        if (e.iconPath) {
          e.iconSrc = [];
          e.iconPath.forEach((path: string) => {
            if (path.charAt(0) === 'h') {
              dataPromises.push(fetchIMG(path).then(img => {
                e.iconSrc.push(img);
              }));
            }
          });
        }
      });

      const bldCode = this.paramMatches && this.paramMatches[1];
      const bldVals = Object.values(blds);
      this._setActiveBuilding(bldCode ?
        // Set `activeBuilding` to the building matching the provided code
        // or the first building.
        bldVals.filter(b => b.code === bldCode)[0] : bldVals[0]
      );

      const floorNum = this.paramMatches &&
          this.paramMatches[2] !== undefined &&
          Number(this.paramMatches[2]);
      this._setActiveFloors(floorNum || undefined);

      Promise.all(dataPromises).then(() => {
        this.loaded = true;
        this.dataLoaded.emit(this.appData);
      });
    }
  }

  /**
   * Handles when the `rula-menu-nav` fires a BuildingChanged event.
   * @param newBuilding A new Building object to make the active Building.
   */
  _onBuildingChanged(newBuilding: Building) {
    this._setActiveBuilding(newBuilding);
  }

  /**
   * Handles when the `rula-map-nav` component fires a FloorChanged event.
   * @param newFloor The Floor object to set as the new active Floor.
   */
  _onFloorChanged(newFloor: Floor) {
    this._setActiveFloor(newFloor);
  }

  /**
   * Sets the currently active Building object.  Also updates any other active
   * elements accordingly.
   *
   * @param building The building to set as the active Building
   */
  _setActiveBuilding(building: Building) {
    this.activeBuilding = { ...building };
    // Since the building changed, the floors need to be set to match.
    this._setActiveFloors();
  }

  /**
   * Sets the currently active Floors.  This is simply the list of floors
   * belonging to the currently active building.
   *
   * @param floorNumber Optional.  The number of a floor to set as the active
   * Floor.  If not specified the first floor of the currently active Building
   * will be set as active.
   */
  _setActiveFloors(floorNumber?: number) {
    if (this.activeBuilding !== undefined &&
        this.activeBuilding.hasOwnProperty('floors')) {
      this.activeFloors = { ...this.activeBuilding.floors };
      const flrs = Object.values(this.activeFloors);
      this._setActiveFloor(floorNumber === undefined ?
        flrs[0] : flrs.filter(f => f.number === floorNumber)[0]);
    }
  }

  /**
   * Sets the currently active Floor object.  Also updates any other components
   * that should change when the floor changes.
   *
   * @param floor The Floor object to set as the currently active Floor.
   */
  _setActiveFloor(floor: Floor) {
    this.activeFloor = { ...floor };
    this._setActiveElements();
    this._setActiveFloorplan();
  }

  /**
   * Sets the list of currently active elements.
   */
  _setActiveElements() {
    if (this.activeFloor !== undefined) {
      this.activeElements = { ...this.activeFloor.elements };
    }
  }

  /**
   * Sets the currently active Element.
   *
   * @param element The Element object to set as the currently active Element.
   */
  _setActiveElement(element?: MapElement) {
    if (element) {
      this.activeElement = { ...element };
      this.sideSheet_.open();
    } else {
      this.activeElement = undefined;
      this.sideSheet_.close();
      if (this.mapEl) {
        this.mapEl.clearActiveElement();
      }
    }
  }

  /**
   * Sets the currently active floorplan image.
   *
   * @param imgSrc The image that should be used as the currently active
   * Floorplan.
   */
  _setActiveFloorplan(imgSrc?: string) {
    if (this.activeFloor !== undefined) {
      const i = new Image();
      i.src = imgSrc === undefined ? this.activeFloor.floorplan : imgSrc;
      this.activeFloorplan = i;
    }
  }

  onMapRendered() {
    if (this.mapEl) {
      if (!this.activeElement) {
        this.mapEl.clearActiveElement();
      } else {
        this.mapEl.setActiveElement(this.activeElement.id);
      }
    }
  }

  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--map': true,
        'rula-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    // const detail = this.activeElement && Object.values(this.activeElement.details)[0];

    if (this.loaded) {
      return ([
        <stencil-route-title pageTitle="Directory" />,
        <rula-map-container
            buildings={this.appData.buildings}>
        </rula-map-container>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
