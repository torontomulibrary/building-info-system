import '@rula/web-components';
import { Component, Element, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { MatchResults } from '@stencil/router';

import {
  Building,
  Floor,
  FloorMap,
  MapData,
  MapElement,
  MapElementDetail,
  MapElementMap,
} from '../../interface';

import { fetchIMG } from '../../utils/fetch';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
  host: {
    theme: 'rula-view rula-view--map',
  },
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

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

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

  /**
   * A list of all the Buildings.
   */
  @Prop() data!: MapData;
  @Watch('data')
  _onDataChanged() {
    this.parseData();
  }

  /**
   * A list of all the Elements currently displayed on the Map.
   */
  @State() activeElements!: MapElementMap;

  /**
   * A string matched from the URL that should be used to pre-select a specific
   * building, building and floor, or building, floor and element.
   */
  @State() query = '';

  /**
   * A URL used to access when loading data.
   */
  @Prop() apiUrl!: string;

  /**
   * The results coming from `stencil-router` that contain any URL matches.
   */
  @Prop() match!: MatchResults;

  componentWillLoad() {
    // Check the URL value to see if any Building, Floor and or Location was
    // provided.  Must be in the form BLD[FLR][RM].
    // Where BLD is the three letter building code, FLR is the floor number,
    // and RM is the 'room number'.  The `room number` is actually the full
    // location code (e.g. SLC508)
    if (this.match && this.match.params && this.match.params.query) {
      const query = this.match.params.query;
      const re = /([A-Z]{3})(\d{2}(?=.{2,}|$)|\d{1})?.*/;
      this.paramMatches = re.exec(query);
    } else {
      this.paramMatches = undefined;
    }
  }

  async parseData() {
    if (this.data !== undefined) {
      // Process buildings
      const bldCode = this.paramMatches && this.paramMatches[1];
      this.activeBuilding = bldCode ?
        // If a building code was provided, select that as the first building.
        Object.values(this.data.buildings).filter(b => b.code === bldCode)[0] :
        // Otherwise, just select the first building.
        Object.values(this.data.buildings)[0];

      // Add references to the floors of each building.
      Object.values(this.data.buildings).forEach((b: Building) => {
        b.floors = Object.values(this.data.floors || {}).reduce((ob: FloorMap, f: Floor) => {
          if (f.buildingId === b.id) ob[f.id] = f;
          return ob;
        }, {} as Floor);
      });

      // Now that the floors are assigned to each building, set the active floors.
      const floorNum = this.paramMatches && Number(this.paramMatches[2]);
      this._setActiveFloors(floorNum || undefined);

      // Get the first floor by looking at the first floor of the current (first)
      // building.
      // let firstFloor: Floor;
      this.activeFloor = typeof floorNum === 'number' ?
        // If a floor number was provided, select it.
        Object.values(this.activeFloors).filter(f => f.number === floorNum)[0] :
        // Use the first floor as the one displayed.
        Object.values(this.activeFloors)[0];

      Object.values(this.data.floors).forEach((f: Floor) => {
        f.elements = Object.values(this.data.elements || {}).reduce((ob, e) => {
          if (e.floorId === f.id) ob[e.id] = e;
          return ob;
        }, {} as MapElement);
      });

      Object.values(this.data.elements).forEach(async (e: MapElement) => {
        e.details = Object.values(this.data.details || {}).reduce((ob, d) => {
          if (d.elementId === e.id) ob[d.id] = d;
          return ob;
        }, {} as MapElementDetail);

        if (e.iconPath && e.iconPath.charAt(0) === 'h') {
          await fetchIMG(e.iconPath).then(img => {
            e.iconSrc = img;
          });
        }
      });

      this._setActiveElements();

      // Get the floorplan of the first building.  This will be loaded immediately.
      // Remaining floorplan images will be loaded asynchronously after the fact.
      await fetchIMG(this.activeFloor.floorplan).then(firstImg => {
        // Store the src for the loaded blob and set it as the active map.
        this.activeFloor.floorplan = firstImg;
        if (typeof firstImg === 'string' && firstImg !== '') {
          this._setActiveFloorplan(firstImg);
        }

        Object.values(this.data.floors || {}).forEach((f: Floor) => {
          // Once the floorplan is loaded, the url will be `blob:http...` so check
          // if the floorplan starts with the `h` of http.
          if (f.floorplan && f.floorplan.charAt(0) === 'h') {
            fetchIMG(f.floorplan).then(img => {
              // Store the blob source when loaded.
              f.floorplan = img;
            });
          }
        });

        return firstImg;
      });
    }
  }

  componentDidLoad() {
    this.parseData();
  }

  onElementSelected(detail: any) {
    this.activeElement = { ...detail };
  }

  onElementDeselected() {
    this.activeElement = undefined;
  }

  @Method()
  setActiveElementByDetail(detailId: number) {
    // Perform a lookup to see which Element the detail belongs to, which floor
    // the Element is on and which Building the floor is in.
    // Then change the building, floor and element to match.
    const dt = this.data.details[detailId];
    const el = this.data.elements[dt.elementId];
    const fl = this.data.floors[el.floorId];
    const bl = this.data.buildings[fl.buildingId];
    this._setActiveBuilding(bl);
    this._setActiveFloor(fl);
    this._setActiveElement(el);
  }

  @Listen('mapNavBuildingChanged')
  _onMapNavBuildingChanged(e: CustomEvent) {
    this._onBuildingChanged(e.detail);
  }

  @Listen('mapNavFloorChanged')
  _onMapNavFloorChanged(e: CustomEvent) {
    this._onFloorChanged(e.detail);
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
    if (this.activeBuilding !== undefined) {
      this.activeFloors = { ...this.activeBuilding.floors };
      this._setActiveFloor(floorNumber === undefined ?
        Object.values(this.activeFloors)[0] :
        Object.values(this.activeFloors).filter(f => f.number === floorNumber)[0]);
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
  _setActiveElement(element: MapElement) {
    this.activeElement = { ...element };
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

  render() {
    const buildings = this.data && this.data.buildings;

    return ([
      <stencil-route-title title="Directory" />,
      <rula-map
        ref={elm => this.mapEl = elm as HTMLRulaMapElement}
        class="rula-map"
        elements={this.activeElements}
        mapImage={this.activeFloorplan}
        onElementSelected={e => this.onElementSelected(e.detail)}
        onElementDeselected={() => this.onElementDeselected()}
        onMapRendered={() => this.onMapRendered()}>
      </rula-map>,

      <rula-detail-panel
        activeElement={this.activeElement}>
      </rula-detail-panel>,

      <rula-map-nav
        class="rula-map-nav"
        activeFloors={this.activeFloors}
        allBuildings={buildings}
        activeBuilding={this.activeBuilding}
        activeFloor={this.activeFloor}>
      </rula-map-nav>,
    ]);
  }
}
