import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { LocationSegments } from '@stencil/router';

import {
  BuildingMap,
  CalEvent,
  FaqMap,
  // FloorMap,
  MapData,
  // MapElementDetailMap,
  // MapElementMap,
} from '../interface';
import { EventParser } from '../utils/event-parser';
import { fetchJSON } from '../utils/fetch';

@Component({
  tag: 'rula-bis',
  styleUrl: 'app.scss',
})
export class App {
  // private allFloors?: FloorMap;
  // private allElements?: MapElementMap;
  // private allDetails?: MapElementDetailMap;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

  /**
   * Keep track of the app width in order to change the interface.
   *
   * @todo Does this really need to be an app state?  Is it expected to change
   * during app use?  Only real case may be changing device from portrait to
   * landscape.
   */
  @State() appWidth = window.innerWidth;

  @State() allFaqs?: FaqMap;
  @State() allEvents?: CalEvent[];

  @State() allBuildings?: BuildingMap;

  @State() mapData?: MapData;

  /**
   * Flag indicating if the side drawer is open.
   */
  @State() drawerOpen!: boolean;

  @State() isLoading = true;
  @State() eventsLoaded = false;

  @Prop({ context: 'location' }) location?: LocationSegments;

  /**
   * A URL used to access when loading data.
   */
  @Prop() apiUrl!: string;

  /**
   * A URL used to load ICAL event information.
   */
  @Prop() icalUrl!: string;

  /**
   * The displayed title of the application.
   */
  @Prop() appTitle = '';

  @Prop() baseUrl = '';

  componentWillLoad() {
    // Load resources.
    this.loadData();
    this.loadEvents();
    this.isLoading = false;
  }

  @Listen('window:resize')
  onresize() {
    this.appWidth = window.innerWidth;
  }

  loadEvents() {
    const parser: EventParser = new EventParser();

    parser.subscribe(() => {
      this.allEvents = parser.getFutureEvents(52);
      this.eventsLoaded = true;
    });

    parser.loadIcal(this.icalUrl);
  }

  async loadData() {
    const buildings = await fetchJSON(this.apiUrl + 'buildings');
    const details = await fetchJSON(this.apiUrl + 'details');
    const elements = await fetchJSON(this.apiUrl + 'elements');
    const faqs = await fetchJSON(this.apiUrl + 'faqs');
    const floors = await fetchJSON(this.apiUrl + 'floors');

    this.allFaqs = faqs;
    this.allBuildings = buildings;

    this.mapData = {
      buildings,
      details,
      elements,
      floors,
    };
  }

  /**
   * Listen for a `resultSelected` event from the search bar. This occurs when
   * the user selects one of the results from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  @Listen('resultSelected')
  _onResultSelected(e: CustomEvent) {
    const viewMap = this.root.querySelector('.rula-view--map') as HTMLViewMapElement;
    if (viewMap && viewMap.hasOwnProperty('setActiveElementByDetail')) {
      viewMap.setActiveElementByDetail(e.detail);
    }
  }

  render() {
    if (this.isLoading) {
      return (
        <div class="rula-loader">
          Loading...
        </div>
      );
    } else {
      return ([
        <rula-app-bar
            appTitle={this.appTitle}
            searchData={this.mapData && this.mapData.details}
            onMenuClicked={_ => { this.drawerOpen = true; }}>
        </rula-app-bar>,

        <rula-drawer
            open={this.drawerOpen}
            onDrawerClose={_ => { this.drawerOpen = false; }}>
          <header class="rula-drawer__header">
            <div class="rula-drawer__header-content">
              <button class="material-icons mdc-top-app-bar__navigation-icon"
                aria-label="Close navigation menu.">close</button>
              <span class="mdc-top-app-bar__title">{this.appTitle}</span>
            </div>
          </header>
          <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
            <stencil-route-link anchorClass="mdc-list-item"
                activeClass="mdc-list-item--activated"
                anchorTabIndex="0"
                url={`${this.baseUrl}/`} exact>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">home</i>Home
            </stencil-route-link>
            <stencil-route-link anchorClass="mdc-list-item"
                activeClass="mdc-list-item--activated"
                anchorTabIndex="0"
                url={`${this.baseUrl}/map`}>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">map</i>Directory
            </stencil-route-link>
            <stencil-route-link anchorClass="mdc-list-item"
                activeClass="mdc-list-item--activated"
                anchorTabIndex="0"
                url={`${this.baseUrl}/building`}>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">business</i>Building Info
            </stencil-route-link>
            <stencil-route-link anchorClass="mdc-list-item"
                activeClass="mdc-list-item--activated"
                anchorTabIndex="0"
                url={`${this.baseUrl}/event`}>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">event</i>Events
            </stencil-route-link>
            <stencil-route-link anchorClass="mdc-list-item"
                activeClass="mdc-list-item--activated"
                anchorTabIndex="0"
                url={`${this.baseUrl}/faq`}>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">question_answer</i>FAQs
            </stencil-route-link>
          </nav>
        </rula-drawer>,

        <main class="rula-main-content">
          <stencil-router id="router" titleSuffix=" | RULA Finder">
            <stencil-route-switch>
              <stencil-route
                  url={`${this.baseUrl}/`}
                  component="view-home"
                  exact={true}>
              </stencil-route>
              <stencil-route
                url={[`${this.baseUrl}/building`, `${this.baseUrl}/building/`]}
                component="view-building"
                componentProps={{ allBuildings: this.allBuildings }}>
              </stencil-route>
              <stencil-route
                url={[`${this.baseUrl}/event`, `${this.baseUrl}/event/`]}
                component="view-event"
                componentProps={{ allEvents: this.allEvents }}>
              </stencil-route>
              <stencil-route
                url={[`${this.baseUrl}/faq`, `${this.baseUrl}/faq/`]}
                component="view-faq"
                componentProps={{ allFaqs: this.allFaqs }}>
              </stencil-route>
              <stencil-route
                url={[`${this.baseUrl}/map`, `${this.baseUrl}/map/:query`]}
                component="view-map"
                componentProps={{
                  data: this.mapData,
                }}>
              </stencil-route>
            </stencil-route-switch>
          </stencil-router>
        </main>,
      ]);
    }
  }
}
