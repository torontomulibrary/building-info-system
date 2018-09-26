import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';

import { MDCSelect } from '@material/select';
import { MDCTabBar } from '@material/tab-bar';
// import { MDCTabScroller } from '@material/tab-scroller';

import {
  Building,
  BuildingMap,
  Floor,
  FloorMap,
} from '../../interface.js';

@Component({
  tag: 'rula-map-nav',
  styleUrl: 'map-nav.scss',
  host: {
    theme: 'rula-map-nav',
  },
})

export class MapNav {
  /**
   * The MDCSelect component used to pick and display the current Building.
   */
  private bldSelect!: MDCSelect;

  /**
   * The MDCSelect component used to pick and display the current Floor on
   * small (mobile) screens.
   */
  private _floorSelect!: MDCSelect;

  /**
   * The MDCTabBar component used to pick and display the current Floor on
   * wide (non-mobile) screens.
   */
  private floorTabs!: MDCTabBar;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLElement;

  // @State() buidlingSheetOpen = false;

  /**
   * The currently active Building.
   */
  @Prop() activeBuilding!: Building;

  /**
   * The currently active Floor.
   */
  @Prop() activeFloor!: Floor;
  @Watch('activeFloor')
  onActiveFloorChanged(newActiveFloor?: Floor) {
    if (this.floorTabs && newActiveFloor) {
      // Update the active (selected) floor tab.
      this.floorTabs.activeTabIndex =
        Object.values(this.activeFloors).findIndex(f => f.id === newActiveFloor.id);
    }
  }

  /**
   * A list of all the Floors of the currenly active Building
   */
  @Prop() activeFloors!: FloorMap;

  /**
   * A list of all the buildings.
   */
  @Prop() allBuildings!: BuildingMap;

  /**
   * An event emitted when the selected Building changes.
   */
  @Event() mapNavBuildingChanged!: EventEmitter;

  /**
   * An event emitted when the selected Floor changes.
   */
  @Event() mapNavFloorChanged!: EventEmitter;

  componentDidUpdate() {
    if (!this.bldSelect && this.root.querySelectorAll('option').length > 0) {
      const bldSelectRoot = this.root.querySelector('.mdc-select--buildings');
      if (bldSelectRoot) {
        this.bldSelect = new MDCSelect(bldSelectRoot);
      }
      this.bldSelect.listen('change', _ => {
        this.mapNavBuildingChanged.emit(this.allBuildings[Number(this.bldSelect.value)]);
      });
    }

    if (!this._floorSelect && this.root.querySelectorAll('option').length > 0) {
      const floorSelectRoot = this.root.querySelector('.mdc-select--floors');
      if (floorSelectRoot) {
        this._floorSelect = new MDCSelect(floorSelectRoot);
      }
      this._floorSelect.listen('change', _ => {
        this.mapNavFloorChanged.emit(this.activeFloors[Number(this._floorSelect.value)]);
      });
    }

    if (!this.floorTabs && this.root.querySelectorAll('#tab-bar button').length > 0) {
      const tabBarRoot = this.root.querySelector('#tab-bar');
      if (tabBarRoot) {
        this.floorTabs = new MDCTabBar(tabBarRoot);
        this.floorTabs.listen('MDCTabBar:activated', e => {
          this.mapNavFloorChanged.emit(
            this.activeFloors[Number(Object.keys(this.activeFloors)[e.detail.index])]);
        });
      }
    }
  }

  render() {
    if (!(this.allBuildings && this.activeFloors)) return;

    const buildings = Object.values(this.allBuildings);
    const floors = Object.values(this.activeFloors);

    return ([
      <div class="mdc-select mdc-select--buildings">
        <select class="mdc-select__native-control">
          {buildings.map(b =>
            <option value={b.id}
                selected={this.activeBuilding.id === b.id}>
              {b.name}
            </option>
          )}
        </select>
        <div class="mdc-floating-label mdc-floating-label--float-above">Current Building</div>
        <div class="mdc-line-ripple"></div>
      </div>,
      <div class="mdc-tab-bar" id="tab-bar" role="tablist">
        <div class="mdc-tab-scroller mdc-tab-scroller--align-center">
          <div class="mdc-tab-scroller__scroll-area">
            <div class="mdc-tab-scroller__scroll-content">
              {floors.map(f =>
              <button role="tab"
                  tabindex={f.id === this.activeFloor.id ? '0' : '-1'}
                  class={`mdc-tab ${f.id === this.activeFloor.id ? 'mdc-tab--active' : ''}`}>
                <span class="mdc-tab__content">
                  <span>{f.name}</span>
                </span>
                <span class={`mdc-tab-indicator ${f.id === this.activeFloor.id ? 'mdc-tab-indicator--active' : ''}`}>
                  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                </span>
                <span class="mdc-tab__ripple"></span>
              </button>
              )}
            </div>
          </div>
        </div>
      </div>,
      <div class="mdc-select mdc-select--floors">
        <select class="mdc-select__native-control">
          {floors.reverse().map(f =>
            <option value={f.id}
                selected={this.activeFloor.id === f.id}>
              {f.name}
            </option>
          )}
        </select>
        <div class="mdc-floating-label mdc-floating-label--float-above">Current Floor</div>
        <div class="mdc-line-ripple"></div>
      </div>,
    ]);
  }
}
