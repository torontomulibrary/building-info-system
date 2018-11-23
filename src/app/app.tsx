import { Component, Element, Listen, Prop, State } from '@stencil/core';

import { BASE_URL } from '../global/constants';
// import { AppData } from '../interface';

@Component({
  tag: 'rula-bis',
  styleUrl: 'app.scss',
})
export class App {
  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

  /**
   * The master collection of application data.  Like a Redux store but without
   * the overhead.
   */
  // @State() appData: AppData = {
  //   // apiUrl: '',
  //   // baseUrl: '',
  //   buildings: {},
  //   details: {},
  //   elements: {},
  //   events: [],
  //   faqs: {},
  //   floors: {},
  //   // eventUrl: '',
  //   // searchUrl: '',
  // };

  /**
   * Keep track of the app width in order to change the interface.
   *
   * @todo Does this really need to be an app state?  Is it expected to change
   * during app use?  Only real case may be changing device from portrait to
   * landscape.
   */
  @State() appWidth = window.innerWidth;

  /**
   * Flag indicating if the side drawer is open.
   */
  @State() drawerOpen!: boolean;

  @State() appLoaded = false;
  @State() eventsLoaded = false;

  /**
   * A URL used to access when loading data.
   */
  // @Prop() apiUrl?: string;

  // @Prop() searchUrl?: string;

  /**
   * A URL used to load ICAL event information.
   */
  // @Prop() eventUrl!: string;

  /**
   * The displayed title of the application.
   */
  @Prop() appTitle = '';

  // @Prop() baseUrl = '';

  componentWillLoad() {
    // if (this.apiUrl === undefined) {
    //   throw new Error('API url not specified. Can not continue.');
    // }

    // if (this.searchUrl === undefined) {
    //   throw new Error('Search url not specified. Can not continue.');
    // }

    // const apiUrl = this.apiUrl;
    // const baseUrl = this.baseUrl;
    // const searchUrl = this.searchUrl;
    // const eventUrl = this.eventUrl;

    // Object.assign(this.appData, { apiUrl, baseUrl, eventUrl, searchUrl });
  }

  componentDidLoad() {
    const el = document.getElementById('splash-screen');
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }

    this.appLoaded = true;
  }

  @Listen('window:resize')
  onresize() {
    this.appWidth = window.innerWidth;
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
      // viewMap.setActiveElementByDetail(e.detail);
      console.log(e.detail);
    }
  }

  // @Listen('getBookLocations')
  // async _onGetBookLocations(e: CustomEvent) {
  //   // console.log(e.detail);
  // }

  // @Listen('dataLoaded')
  // _onDataLoaded(e: CustomEvent) {
  //   this.appData = { ...e.detail };
  // }

  hostData() {
    return {
      class: {
        'rula-bis': true,
        'rula-bis--loaded': this.appLoaded,
      },
    };
  }

  render() {
    return ([
      <rula-app-bar
          appTitle={this.appTitle} appWidth={this.appWidth}
          // searchData={this.appData.details}
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
              url={`${BASE_URL}/`} exact>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">home</i>Home
          </stencil-route-link>
          <stencil-route-link anchorClass="mdc-list-item"
              activeClass="mdc-list-item--activated"
              anchorTabIndex="0"
              url={`${BASE_URL}/directory`}>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">map</i>Directory
          </stencil-route-link>
          <stencil-route-link anchorClass="mdc-list-item"
              activeClass="mdc-list-item--activated"
              anchorTabIndex="0"
              url={`${BASE_URL}/books`}>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">import_contacts</i>Books
          </stencil-route-link>
          <stencil-route-link anchorClass="mdc-list-item"
              activeClass="mdc-list-item--activated"
              anchorTabIndex="0"
              url={`${BASE_URL}/computers`}>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">computer</i>Computers
          </stencil-route-link>
          <stencil-route-link anchorClass="mdc-list-item"
              activeClass="mdc-list-item--activated"
              anchorTabIndex="0"
              url={`${BASE_URL}/building`}>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">business</i>Building Info
          </stencil-route-link>
          <stencil-route-link anchorClass="mdc-list-item"
              activeClass="mdc-list-item--activated"
              anchorTabIndex="0"
              url={`${BASE_URL}/events`}>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">event</i>Events
          </stencil-route-link>
          <stencil-route-link anchorClass="mdc-list-item"
              activeClass="mdc-list-item--activated"
              anchorTabIndex="0"
              url={`${BASE_URL}/faqs`}>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">question_answer</i>FAQs
          </stencil-route-link>
        </nav>
      </rula-drawer>,

      <main class="rula-main-content">
        <stencil-router id="router" titleSuffix={` | ${this.appTitle}`}>
          <stencil-route-switch>
            <stencil-route
                url={`${BASE_URL}/`}
                component="view-home"
                exact={true}
                componentProps={{
                  appLoaded: this.appLoaded,
                }}>
            </stencil-route>
            <stencil-route
              url={[
                `${BASE_URL}/directory/:roomNo?`,
                `${BASE_URL}/directory`,
              ]}
              component="view-map"
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: 'directory',
              }}>
            </stencil-route>
            <stencil-route
              url={[
                `${BASE_URL}/books/map/:callNo`,
              ]}
              component="view-map"
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: 'book',
              }}>
            </stencil-route>
            <stencil-route
              url={[
                `${BASE_URL}/computers/`,
                `${BASE_URL}/computers`,
              ]}
              component="view-map"
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: 'computer',
              }}>
            </stencil-route>
            <stencil-route
              url={[
                `${BASE_URL}/building/`,
                `${BASE_URL}/building`,
              ]}
              component="view-building"
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route
              url={[
                `${BASE_URL}/books/`,
                `${BASE_URL}/books`,
              ]}
              component="view-book"
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route
              url={[
                `${BASE_URL}/events/`,
                `${BASE_URL}/events`,
              ]}
              component="view-event"
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route
              url={[
                `${BASE_URL}/faqs/`,
                `${BASE_URL}/faqs`,
              ]}
              component="view-faq"
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route
              url={[`${BASE_URL}/sr/:query?`]}
              component="view-search"
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
          </stencil-route-switch>
        </stencil-router>
      </main>,
    ]);
  }
}
