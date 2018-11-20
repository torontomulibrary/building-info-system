import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';

import { MDCSelect } from '@material/select/index';
import { MDCTabBar } from '@material/tab-bar/index';

import {
  Building,
  BuildingMap,
  Floor,
  FloorMap,
} from '../../interface.js';

@Component({
  tag: 'rula-map-nav',
  styleUrl: 'map-nav.scss',
})

export class MapNav {
  /**
   * Event handler for when the `MDCTabBar:activated` event fires.
   */
  private handleTabActivated = e => this.floorChanged.emit(
    Number(Object.keys(this.floors)[e.detail.index]));

  /**
   * The MDCSelect component used to pick and display the current Building.
   */
  private bldSelect!: MDCSelect;

  /**
   * The MDCSelect component used to pick and display the current Floor on
   * small (mobile) screens.
   */
  private floorSelect!: MDCSelect;

  /**
   * The MDCTabBar component used to pick and display the current Floor on
   * wide (non-mobile) screens.
   */
  private floorTabs!: MDCTabBar;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLElement;

  /**
   * The `id` of the currently active building.
   */
  @Prop() activeBuilding!: number;

  /**
   * The `id` of the currently active floor.
   */
  @Prop() activeFloor!: number;
  @Watch('activeFloor')
  onActiveFloorChanged(newFloor?: number) {
    if (this.floorTabs && newFloor) {
      // Update the active (selected) floor tab.
      this.floorTabs.activateTab(
        Object.values(this.floors).findIndex(f => f.id === newFloor));
    }
  }

  /**
   * An id-indexed map of the buildings.
   */
  @Prop() buildings!: BuildingMap;

  /**
   * An id-indexed map of floors.
   */
  @Prop() floors!: FloorMap;

  /**
   * An event emitted when the selected Building changes.
   */
  @Event() buildingChanged!: EventEmitter;

  /**
   * An event emitted when the selected Floor changes.
   */
  @Event() floorChanged!: EventEmitter;

  componentDidLoad() {
    this._setupDom();
  }

  componentDidUpdate() {
    this._setupDom();
  }

  _setupDom() {
    if (!this.bldSelect && this.root.querySelectorAll('option').length > 0) {
      const bldSelectRoot = this.root.querySelector('.mdc-select--buildings');
      if (bldSelectRoot) {
        this.bldSelect = new MDCSelect(bldSelectRoot);
      }
      this.bldSelect.listen('change', _ => {
        this.buildingChanged.emit(Number(this.bldSelect.value));
      });
    }

    if (!this.floorSelect && this.root.querySelectorAll('option').length > 0) {
      const floorSelectRoot = this.root.querySelector('.mdc-select--floors');
      if (floorSelectRoot) {
        this.floorSelect = new MDCSelect(floorSelectRoot);
      }
      this.floorSelect.listen('change', _ => {
        this.floorChanged.emit(Number(this.floorSelect.value));
      });
    }

    if (this.root.querySelectorAll('#tab-bar button').length > 0) {
      const tabBarRoot = this.root.querySelector('#tab-bar');
      if (tabBarRoot) {
        if (this.floorTabs) {
          // Remove old instance, if exists.
          this.floorTabs.unlisten('MDCTabBar:activated', this.handleTabActivated);
          this.floorTabs.destroy();
          this.floorTabs = undefined;
        }
        this.floorTabs = new MDCTabBar(tabBarRoot);
        this.floorTabs.listen('MDCTabBar:activated', this.handleTabActivated);
      }
    }
  }

  hostData() {
    return {
      class: {
        'rula-map-nav': true,
      },
    };
  }

  render() {
    const buildings = Object.values(this.buildings);
    const floors = Object.values(this.floors);

    return ([
      <div class="mdc-select mdc-select--buildings">
        <i class="mdc-select__dropdown-icon"></i>
        <select class="mdc-select__native-control">
          {buildings.map((b: Building) =>
            <option value={b.id}
                selected={this.activeBuilding === b.id}>
              {b.name}
            </option>
          )}
        </select>
        <div class="mdc-floating-label mdc-floating-label--float-above">
          Current Building
        </div>
        <div class="mdc-line-ripple"></div>
      </div>,
      <div class="mdc-tab-bar" id="tab-bar" role="tablist">
        <div class="mdc-tab-scroller mdc-tab-scroller--align-center">
          <div class="mdc-tab-scroller__scroll-area">
            <div class="mdc-tab-scroller__scroll-content">
              {floors.map((f: Floor) =>
              <button role="tab"
                  tabindex={f.id === this.activeFloor ? '0' : '-1'}
                  class={`mdc-tab ${f.id === this.activeFloor ? 'mdc-tab--active' : ''}`}>
                <span class="mdc-tab__content">
                  <span>{f.name}</span>
                </span>
                <span class={`mdc-tab-indicator ${f.id === this.activeFloor ? 'mdc-tab-indicator--active' : ''}`}>
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
          {floors.reverse().map((f: Floor) =>
            <option value={f.id}
                selected={this.activeFloor === f.id}>
              {f.name}
            </option>
          )}
        </select>
        <div class="mdc-floating-label mdc-floating-label--float-above">
          Current Floor
        </div>
        <div class="mdc-line-ripple"></div>
      </div>,
    ]);
  }
}
