import { Component, Element, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';

import { APP_TITLE } from '../../global/constants';

import {
  LazyStore,
  Building,
  BuildingMap,
  Floor,
  FloorMap,
  MapElement,
} from '../../interface';

import map from '../../reducers/map-reducer';
import {
  getMapData,
  updateActiveBuilding,
  updateActiveFloor,
  updateActiveElement,
} from '../../actions/map-actions';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
  host: {
    theme: 'rula-view rula-view__map'
  }
})

export class ViewMap {
  /**
   * Internal reference to the `rula-map` component element.
   */
  private mapEl: HTMLRulaMapElement;

  /**
   * Callback function used to unsubscribe from the Redux store.
   */
  private storeUnsubscribe: Function;

  /**
   * Root element of this component.
   */
  @Element() root: HTMLElement;

  /**
   * The currently active Building.
   */
  @State() activeBuilding: Building;

  /**
   * The currently active MapElement.
   */
  @State() activeElement: MapElement;

  /**
   * The currently active Floor.
   */
  @State() activeFloor: Floor;

  /**
   * Reference to the floorplan image currently being displayed.
   */
  @State() activeFloorplan: any;

  /**
   * A list of all the floors of the current Building.
   */
  @State() activeFloors: FloorMap;

  /**
   * A list of all the Buildings.
   */
  @State() allBuildings: BuildingMap;

  /**
   * A list of all the Elements currently displayed on the Map.
   */
  @State() elements: Object[];

  /**
   * A string matched from the URL that should be used to pre-select a specific
   * building, building and floor, or building, floor and element.
   */
  @State() query = '';

  /**
   * The global Redux store.
   */
  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  /**
   * A URL used to access when loading data.
   */
  @Prop() apiUrl: string;

  /**
   * The results coming from `stencil-router` that contain any URL matches.
   */
  @Prop() match: MatchResults;

  async componentWillLoad() {
    // Check the URL value to see if any Building, Floor and or Location was
    // provided.  Must be in the form BLD[FLR][RM].
    // Where BLD is the three letter building code, FLR is the floor number,
    // and RM is the 'room number'.  The `room number` is actually the full
    // location code (e.g. SLC508)
    let match;
    if (this.match && this.match.params) {
      const query = this.match.params.query;
      const re = /([A-Z]{3})(\d{2}(?=.{2,}|$)|\d{1})?.*/;
      match = re.exec(query);
      match = match || [];
    }

    // Add in the `map` recuder to the Store.
    this.lazyStore.addReducers({map});
    this.storeUnsubscribe = this.lazyStore.subscribe(() =>
      this.stateChanged(this.lazyStore.getState().map)
    );
    
    // Load Map data.
    if (this.apiUrl) {
      this.lazyStore.dispatch(getMapData(this.apiUrl, match[1], parseInt(match[2])));
    } else {
      // Fail preloading with 'Unable to load map data!'
    }

    document.title = `Directory | ${APP_TITLE}`;
  }

  componentDidLoad() {
    this.mapEl = this.root.querySelector('rula-map');
  }

  componentDidUnload() {
    this.storeUnsubscribe();
    document.title = APP_TITLE;
  }

  /**
   * This handles when the state changes.
   * 
   * @param state A copy of the new Redux state.
   */
  stateChanged(state) {
    this.activeBuilding = state.activeBuilding;
    this.activeFloor = state.activeFloor;
    this.allBuildings = state.allBuildings;
    this.activeFloors = state.activeFloors;
    if (typeof state.activeFloorplan == 'string') {
      let i = new Image();
      i.src = state.activeFloorplan;
      this.activeFloorplan = i;
    }
    this.elements = state.activeElements;
    this.activeElement = state.activeElement;

    if (!this.activeElement && this.mapEl) {
      this.mapEl.clearActiveElement()
    }
  }

  onElementSelected(e) {
    // Update the state with the clicked element.
    this.lazyStore.dispatch(updateActiveElement(this.elements[e.detail.id]));
  }

  onElementDeSelected() {
    // Update the store by 'clearing' the selected element.
    this.lazyStore.dispatch(updateActiveElement(undefined));
  }

  render() {
    return ([
      <rula-map
        class='rula-map'
        elements={this.elements}
        mapImage={this.activeFloorplan}
        onElementSelected={e => this.onElementSelected(e)}
        onElementDeselected={_ => this.onElementDeSelected()}>
      </rula-map>,

      <rula-detail-panel></rula-detail-panel>,

      <rula-map-nav
        class='rula-map-nav'
        activeFloors={this.activeFloors}
        allBuildings={this.allBuildings}
        activeBuilding={this.activeBuilding}
        activeFloor={this.activeFloor}
        onActiveFloorChanged={e => this.lazyStore.dispatch(updateActiveFloor(e.detail))}
        onActiveBuildingChanged={e => this.lazyStore.dispatch(updateActiveBuilding(e.detail))}>
      </rula-map-nav>
    ]);
  }
}