import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';

import { MDCSelect } from '@material/select';
import { MDCTabBarScroller, MDCTabBar } from '@material/tabs';

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
    theme: 'rula-map-nav'
  }
})

export class MapNav {
  /**
   * The MDCSelect component used to pick and display the current Building.
   */
  private bldSelect: MDCSelect;

  /**
   * The MDCSelect component used to pick and display the current Floor on
   * small (mobile) screens.
   */
  private _floorSelect: MDCSelect;

  /**
   * The MDCTabBar component used to pick and display the current Floor on
   * wide (non-mobile) screens.
   */
  private floorTabs: MDCTabBar;
  
  /**
   * Root element of this component.
   */
  @Element() root: HTMLElement;

  // @State() buidlingSheetOpen = false;

  /**
   * The currently active Building.
   */
  @Prop() activeBuilding: Building;

  /**
   * The currently active Floor.
   */
  @Prop() activeFloor: Floor;
  @Watch('activeFloor')
  onActiveFloorChanged(newActiveFloor) {
    if (this.floorTabs && newActiveFloor) {
      // Update the active (selected) floor tab.
      this.floorTabs.activeTabIndex =
        Object.values(this.activeFloors).findIndex(f => f.id == newActiveFloor.id);
    }
  }

  /**
   * A list of all the Floors of the currenly active Building
   */
  @Prop() activeFloors: FloorMap;

  /**
   * A list of all the buildings.
   */
  @Prop() allBuildings: BuildingMap;

  /**
   * An event emitted when the selected Building changes.
   */
  @Event() activeBuildingChanged: EventEmitter;

  /**
   * An event emitted when the selected Floor changes.
   */
  @Event() activeFloorChanged: EventEmitter;

  componentDidUpdate() {
    if (!this.bldSelect && this.root.querySelectorAll('option').length > 0) {
      this.bldSelect = new MDCSelect(this.root.querySelector('.mdc-select--buildings'));
      this.bldSelect.listen('change', _ => {
        this.activeBuildingChanged.emit(this.allBuildings[this.bldSelect.value]);
      });
    }

    if (!this._floorSelect && this.root.querySelectorAll('option').length > 0) {
      this._floorSelect = new MDCSelect(this.root.querySelector('.mdc-select--floors'));
      this._floorSelect.listen('change', _ => {
        this.activeFloorChanged.emit(this.activeFloors[this._floorSelect.value]);
      });
    }

    if (!this.floorTabs && this.root.querySelectorAll('#scrollable-tab-bar > a').length > 0) {
      const scroller = new MDCTabBarScroller(
          this.root.querySelector('#tab-bar-scroller'));
      this.floorTabs = scroller.tabBar;
      this.floorTabs.listen('MDCTabBar:change', _ => {
        this.activeFloorChanged.emit(
          this.activeFloors[parseInt(Object.keys(this.activeFloors)[this.floorTabs.activeTabIndex])]);
      });
    }
  }

  // _toggleBuildingSheet() {
  //   this.buidlingSheetOpen = !this.buidlingSheetOpen;
  // }

  render() {
    if (!(this.allBuildings && this.activeFloors)) return;
    
    let buildings = Object.values(this.allBuildings);
    let floors = Object.values(this.activeFloors);

    return ([
      <div class="mdc-select mdc-select--buildings">
        <select class="mdc-select__native-control">
          {buildings.map(b => 
            <option value={b.id}
                selected={this.activeBuilding.id == b.id}>
              {b.name}
            </option>
          )}
        </select>
        <div class="mdc-floating-label mdc-floating-label--float-above">Current Building</div>
        <div class="mdc-line-ripple"></div>
      </div>,
      // <div class={`rula-bottom-sheet ${this.buidlingSheetOpen ? "rula-bottom-sheet--open" : ""}`}>
      //   <div class="rula-bottom-sheet__header">
      //     <section class="rula-bottom-sheet__section rula-bottom-sheet__section--align-start">
      //       <span class="rula-two-line-header">
      //         <span class="rula-two-line-header__caption">Current Building</span>
      //         <span class="rula-two-line-header__text">{this.activeBuilding.name}</span>
      //       </span>
      //     </section>
      //     <section class="rula-bottom-sheet__section rula-bottom-sheet__section--align-end">
      //       <button
      //           class="material-icons rula-bottom-sheet__icon"
      //           onClick={_ => this._toggleBuildingSheet()}>
      //         {this.buidlingSheetOpen ? "close" : "keyboard_arrow_up"}</button>
      //     </section>
      //   </div>
      //   <div class="rula-bottom-sheet__content">
      //     <ul class="rula-list">
      //       <li class="rula-list-divider"></li>
      //       <li class="rula-list-item rula-list-item--caption">Other buildings</li>
      //       {buildings.map(b => { if (this.activeBuilding.id == b.id) return; return (
      //         <li id={b.id} class="rula-list-item">
      //           <a>{b.name}</a>
      //         </li>
      //       )})}
      //     </ul>
      //   </div>
      // </div>,
      // <div class="rula-floor-list__caption">
      //   <nav class="rula-floor-list__container">
      //     {floors.map(f =>
      //       <a class={`rula-floor-list__item ${f.id == this.activeFloor.id ? "rula-floor-list__item-active" : ""}`}>{f.number}</a>
      //     )}
      //   </nav>
      // </div>
      <div id="tab-bar-scroller" class="mdc-tab-bar-scroller">
        <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
          <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll back button">
            navigate_before
          </a>
        </div>
        <div class="mdc-tab-bar-scroller__scroll-frame">
          <nav id="scrollable-tab-bar" class="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
            {floors.map(f =>
              <a class={`mdc-tab ${f.id == this.activeFloor.id ? "mdc-tab--active" : ""}`}>{f.name}</a>
            )}
            <span class="mdc-tab-bar__indicator"></span>
          </nav>
        </div>
        <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
          <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll forward button">
            navigate_next
          </a>
        </div>
      </div>,
      <div class="mdc-select mdc-select--floors">
        <select class="mdc-select__native-control">
          {floors.reverse().map(f => 
            <option value={f.id}
                selected={this.activeFloor.id == f.id}>
              {f.name}
            </option>
          )}
        </select>
        <div class="mdc-floating-label mdc-floating-label--float-above">Current Floor</div>
        <div class="mdc-line-ripple"></div>
      </div>
    ]);
  }
}