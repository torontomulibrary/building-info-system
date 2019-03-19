import {
  Component,
  Element,
  Method,
  Prop,
  State,
} from '@stencil/core';

import {
  Building,
  BuildingMap,
  Floor,
  FloorMap,
  MapElementData,
  MapElementDataMap,
} from '../../interface';

@Component({
  tag: 'rl-map-container',
  styleUrl: 'map-container.scss',
})

export class MapContainer {
  /**
   * Internal reference to the `rl-map` component element.
   */
  private mapEl!: HTMLRlMapElement;

  // private sideSheet_!: HTMLRLSideSheetElement;

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
  @State() activeElement?: MapElementData;

  /**
   * A list of all the Elements currently displayed on the Map.
   */
  @State() activeElements!: MapElementDataMap;

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

  @Prop() initialBuilding!: number;

  @Prop() initialFloor!: number;

  @Prop() initialElement?: number;

  @Prop() extraDetails?: {};

  componentWillLoad() {
    this._setActiveBuilding(this.buildings[this.initialBuilding]);
    this._setActiveFloor(this.activeFloors[this.initialFloor]);

    if (this.initialElement) {
      this._setActiveElement(this.activeElements[this.initialElement]);
    }
  }

  onElementSelected(detail: any) {
    this._setActiveElement(detail);
  }

  onElementDeselected() {
    this._setActiveElement();
  }

  @Method()
  setActiveElement(el: MapElementData) {
    this._setActiveElement(el);
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
  _setActiveElement(element?: MapElementData) {
    if (element) {
      this.activeElement = { ...element };
      // this.sideSheet_.open();
    } else {
      this.activeElement = undefined;
      // this.sideSheet_.close();
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

  _sidePanelClosed() {
    if (this.activeElement) {
      this._setActiveElement();
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
        'rl-map-container': true,
      },
    };
  }

  render() {
    const detail = this.activeElement && Object.values(this.activeElement.details)[0];
    const firstDetail = this.activeElement && Object.values(this.activeElement.details)[0].code;
    const extra = this.extraDetails && this.extraDetails[firstDetail];

    return ([
      <rl-map
        ref={elm => this.mapEl = elm as HTMLRlMapElement}
        class="rl-map"
        elements={this.activeElements}
        mapImage={this.activeFloor.floorplan}
        onElementSelected={e => this.onElementSelected(e.detail)}
        onElementDeselected={() => this.onElementDeselected()}
        onMapRendered={() => this.onMapRendered()}>
      </rl-map>,

      <rl-side-sheet open={this.activeElement !== undefined} onClosed={() => this._sidePanelClosed()}>
        <header class="rl-side-sheet__header">
          <span class="rl-side-sheet__title">
            <div class="mdc-typography--body2">{detail && detail.code || ''}</div>
            <div class="mdc-typography--headline6">{detail && detail.name || ''}</div>
          </span>
          <button
              class="material-icons rl-side-sheet__close"
              onClick={_ => { this._setActiveElement(); }}
              aria-label="Close detail panel."
              tabindex={this.activeElement ? '0' : '-1'}>
            close
          </button>
        </header>
        <div class="rl-side-sheet__content">
          <div class="rl-side-sheet__section">
            <div class="rl-side-sheet__subtitle mdc-typography--subtitle2">Description</div>
            {detail && detail.description || ''}
          </div>
          {extra && Object.entries(extra).map(item =>
            <div class="rl-side-sheet__section">
              <div class="rl-side-sheet__subtitle mdc-typography--subtitle2">{item[0].charAt(0).toUpperCase() + item[0].slice(1)}</div>
              {typeof item[1] === 'boolean' ? item[1] ? 'Yes' : 'No' : item[1]}
            </div>
          )}
        </div>
      </rl-side-sheet>,

      <rl-map-nav
        activeBuilding={this.activeBuilding.id}
        activeFloor={this.activeFloor.id}
        buildings={this.buildings}
        floors={this.activeBuilding.floors}
        onBuildingChanged={ev => this._setActiveBuilding(this.buildings[ev.detail])}
        onFloorChanged={ev => this._setActiveFloor(this.activeFloors[ev.detail])}>
      </rl-map-nav>,
    ]);
  }
}
