import { Component, Element, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';

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
  private _storeUnsubscribe: Function;

  @Element() root: HTMLElement;

  @State() _activeBuilding: Building;
  @State() _activeFloor: Floor;
  @State() _activeElement: MapElement;
  @State() _activeFloorplan: any;

  @Prop() match: MatchResults;
  @State() _elements: Object[];
  @State() query = '';

  @State() _allBuildings: BuildingMap;
  @State() _activeFloors: FloorMap;

  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;
  @Prop() apiUrl: string;

  async componentWillLoad() {
    let match;
    if (this.match && this.match.params) {
      const query = this.match.params.query;
      const re = /([A-Z]{3})(\d{2}(?=.{2,}|$)|\d{1})?.*/;
      match = re.exec(query);
      match = match || [];
    }

    this.lazyStore.addReducers({map});
    this._storeUnsubscribe = this.lazyStore.subscribe(() =>
      this._stateChanged(this.lazyStore.getState().map)
    );
    
    if (this.apiUrl) {
      this.lazyStore.dispatch(getMapData(this.apiUrl, match[1], parseInt(match[2])));
    } else {
      // Fail preloading with 'Unable to load map data!'
    }
  }

  componentDidUnload() {
    this._storeUnsubscribe();
  }

  _stateChanged(state) {
    this._activeBuilding = state.activeBuilding;
    this._activeFloor = state.activeFloor;
    this._allBuildings = state.allBuildings;
    this._activeFloors = state.activeFloors;
    if (typeof state.activeFloorplan == 'string') {
      let i = new Image();
      i.src = state.activeFloorplan;
      this._activeFloorplan = i;
    }
    this._elements = state.activeElements;
    this._activeElement = state.activeElement;
  }

  _onElementSelected(e) {
    // Update the state with the clicked element.
    this.lazyStore.dispatch(updateActiveElement(this._elements[e.detail.id]));
  }

  _onElementDeSelected() {
    this.lazyStore.dispatch(updateActiveElement(undefined));
  }

  render() {
    return ([
      <rula-map
        class='rula-map'
        elements={this._elements}
        mapImage={this._activeFloorplan}
        onElementSelected={e => this._onElementSelected(e)}
        onElementDeselected={_ => this._onElementDeSelected()}>
      </rula-map>,

      <rula-detail-panel></rula-detail-panel>,

      <rula-map-nav
        class='rula-map-nav'
        activeFloors={this._activeFloors}
        allBuildings={this._allBuildings}
        activeBuilding={this._activeBuilding}
        activeFloor={this._activeFloor}
        onActiveFloorChanged={e => this.lazyStore.dispatch(updateActiveFloor(e.detail))}
        onActiveBuildingChanged={e => this.lazyStore.dispatch(updateActiveBuilding(e.detail))}>
      </rula-map-nav>
    ]);
  }
}