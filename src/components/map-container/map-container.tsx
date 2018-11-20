import {
  Component,
  Element,
  // Event,
  // EventEmitter,
  Listen,
  // Method,
  Prop,
  State,
  // Watch,
} from '@stencil/core';
// import { MatchResults } from '@stencil/router';

import {
  // AppData,
  // BookDetails,
  Building,
  BuildingMap,
  Floor,
  FloorMap,
  MapElement,
  // MapElementDetail,
  // MapElementDetailMap,
  MapElementMap,
} from '../../interface';

// import { fetchIMG, fetchJSON } from '../../utils/fetch';

@Component({
  tag: 'rula-map-container',
  styleUrl: 'map-container.scss',
})

export class MapContainer {
  /**
   * Internal reference to the `rula-map` component element.
   */
  private mapEl!: HTMLRulaMapElement;

  private sideSheet_!: HTMLRulaSideSheetElement;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

  // @State() loaded = false;

  /**
   * The currently active Building.
   */
  @State() activeBuilding!: Building;

  /**
   * The currently active MapElement.
   */
  @State() activeElement?: MapElement;

  /**
   * A list of all the Elements currently displayed on the Map.
   */
  @State() activeElements!: MapElementMap;

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

  @Prop() buildings!: BuildingMap;

  componentWillLoad() {
    // If no building is specified, select the first one.
    if (this.activeBuilding === undefined) {
      this.activeBuilding = Object.values(this.buildings)[0];
    }

    this.activeFloors = this.activeBuilding.floors;

    // If no floor is specified, select the first one.
    if (this.activeFloor === undefined) {
      this.activeFloor = Object.values(this.activeBuilding.floors)[0];
    }
  }

  onElementSelected(detail: any) {
    this._setActiveElement(detail);
  }

  onElementDeselected() {
    this._setActiveElement();
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
  _onBuildingChanged(newBuilding: number) {
    this._setActiveBuilding(this.buildings[newBuilding]);
  }

  /**
   * Handles when the `rula-map-nav` component fires a FloorChanged event.
   * @param newFloor The Floor object to set as the new active Floor.
   */
  _onFloorChanged(newFloor: number) {
    this._setActiveFloor(this.activeFloors[newFloor]);
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
        'rula-map-container': true,
      },
    };
  }

  render() {
    const detail = this.activeElement && Object.values(this.activeElement.details)[0];

    return ([
      <rula-map
        ref={elm => this.mapEl = elm as HTMLRulaMapElement}
        class="rula-map"
        elements={this.activeElements}
        floorplan={this.activeFloor.floorplan}
        onElementSelected={e => this.onElementSelected(e.detail)}
        onElementDeselected={() => this.onElementDeselected()}
        onMapRendered={() => this.onMapRendered()}>
      </rula-map>,

      <rula-side-sheet ref={el => { this.sideSheet_ = el as HTMLRulaSideSheetElement; }}>
        <header class="rula-side-sheet__header">
          <span class="rula-side-sheet__title">
            <div class="mdc-typography--body2">{detail && detail.code || ''}</div>
            <div class="mdc-typography--headline6">{detail && detail.name || ''}</div>
          </span>
          <button
              class="material-icons rula-side-sheet__close"
              onClick={_ => { this._setActiveElement(); }}
              aria-label="Close detail panel.">
            close
          </button>
        </header>
        <div class="rula-side-sheet__content">
          <div class="rula-side-sheet__section">
            <div class="rula-side-sheet__subtitle mdc-typography--subtitle2">Description</div>
            {detail && detail.description || ''}
          </div>
        </div>
      </rula-side-sheet>,

      <rula-map-nav
        activeBuilding={this.activeBuilding.id}
        activeFloor={this.activeFloor.id}
        buildings={this.buildings}
        floors={this.activeBuilding.floors}
        onBuildingChanged={ev => this._onBuildingChanged(ev.detail)}
        onFloorChanged={ev => this._onFloorChanged(ev.detail)}>
      </rula-map-nav>,
    ]);
  }
}
