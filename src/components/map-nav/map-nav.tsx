import { MDCSelect } from '@material/select/index';
import { MDCTabBar } from '@material/tab-bar/index';
import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

import {
  Building,
  BuildingMap,
  Floor,
  FloorMap,
} from '../../interface.js';

@Component({
  tag: 'rl-map-nav',
  styleUrl: 'map-nav.scss',
})

export class MapNav {
  /**
   * Event handler for when the `MDCTabBar:activated` event fires.
   */
  private handleTabActivated = e => this.floorChanged.emit(
    Object.values(this.floors)[e.detail.index].number);

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
  private floorTabs?: MDCTabBar;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLRlMapNavElement;

  /**
   * The `id` of the currently active building.
   */
  @Prop() activeBuilding!: Building;

  /**
   * The `id` of the currently active floor.
   */
  @Prop() activeFloor!: Floor;

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

  componentWillUpdate() {
    const tabBarRoot = this.root.querySelector('#tab-bar');
    if (this.root.querySelectorAll('#tab-bar button').length > 0 &&
        tabBarRoot && this.floorTabs) {
      // Remove old instance, if exists.
      this.floorTabs.unlisten('MDCTabBar:activated', this.handleTabActivated);
      this.floorTabs.destroy();
      this.floorTabs = undefined;
    }
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
        this.buildingChanged.emit(this.bldSelect.value);
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

    const tabBarRoot = this.root.querySelector('#tab-bar');
    if (this.root.querySelectorAll('#tab-bar button').length > 0 &&
        tabBarRoot) {
      this.floorTabs = new MDCTabBar(tabBarRoot);
      this.floorTabs.listen('MDCTabBar:activated', this.handleTabActivated);
    }
  }

  render() {
    const buildings = Object.values(this.buildings);
    const floors = Object.values(this.floors);

    return (
      <Host class="rl-map-nav">
        <div class="mdc-select mdc-select--buildings">
          <i class="mdc-select__dropdown-icon"></i>
          <select class="mdc-select__native-control">
            {buildings.map((b: Building) =>
              <option value={b.code} disabled={!b.enabled}
                selected={this.activeBuilding.code === b.code}>
                {b.name}
              </option>
            )}
          </select>
          <div class="mdc-floating-label mdc-floating-label--float-above">
            Current Building
          </div>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-tab-bar" id="tab-bar" role="tablist">
          <div class="mdc-tab-scroller mdc-tab-scroller--align-center">
            <div class="mdc-tab-scroller__scroll-area">
              <div class="mdc-tab-scroller__scroll-content">
                {floors.map((f: Floor) =>
                  <button role="tab" disabled={!f.enabled}
                    tabindex={f.code === this.activeFloor.code ? '0' : '-1'}
                    class={`mdc-tab ${f.code === this.activeFloor.code ? 'mdc-tab--active' : ''}`}>
                    <span class="mdc-tab__content">
                      <span>{f.name}</span>
                    </span>
                    <span class={`mdc-tab-indicator ${f.code === this.activeFloor.code ? 'mdc-tab-indicator--active' : ''}`}>
                      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                    </span>
                    <span class="mdc-tab__ripple"></span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div class="mdc-select mdc-select--floors">
          <select class="mdc-select__native-control">
            {floors.reverse().map((f: Floor) =>
              <option value={f.number} disabled={!f.enabled}
                selected={f.code === this.activeFloor.code}>
                {f.name}
              </option>
            )}
          </select>
          <div class="mdc-floating-label mdc-floating-label--float-above">
            Current Floor
          </div>
          <div class="mdc-line-ripple"></div>
        </div>
      </Host>
    );
  }
}
