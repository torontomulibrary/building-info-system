import '@ryersonlibrary/web-components';
import { Component, Element, Listen, State } from '@stencil/core';

import { BASE_URL } from '../global/config';
import {
  APP_TITLE,
  LOCAL_STORAGE_KEY,
  MAP_TYPE,
  ROUTES,
} from '../global/constants';
import { FaqMap, MapElementDetailMap } from '../interface';
import { loadData } from '../utils/load-data';

@Component({
  tag: 'rl-bis',
  styleUrl: 'app.scss',
})

export class RLApp {
  /**
   * Object containing all the pages used for the nav menu of the App.
   */
  private appPages = [
    {
      title: 'Home',
      url: '',
      icon: 'home',
      component: 'view-home',
    },
    {
      title: 'Directory',
      url: ROUTES.DIRECTORY,
      icon: 'map',
    },
    {
      title: 'Books',
      url: ROUTES.BOOKS,
      icon: 'import_contacts',
      component: 'view-map',
      params: ':roomNo?',
    },
    {
      title: 'Computers',
      url: ROUTES.COMPUTERS,
      icon: 'computer',
    },
    {
      title: 'Buildings',
      url: ROUTES.BUILDINGS,
      icon: 'business',
    },
    {
      title: 'Events',
      url: ROUTES.EVENTS,
      icon: 'event',
    },
    {
      title: 'FAQs',
      url: ROUTES.FAQS,
      icon: 'question_answer',
    },
  ];

  private _locationData: {} = {};
  private _faqData: {} = {};

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

  /**
   * Flag indicating if the side drawer is open.
   */
  @State() drawerOpen!: boolean;

  /**
   * Global flag indicating if the whole application has loaded.
   */
  @State() appLoaded = false;

  /**
   * Lifecycle event fired after the component has rendered the first time.
   */
  async componentDidLoad() {
    const el = document.getElementById('splash-screen');
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }

    // Load map details.
    await loadData('details', LOCAL_STORAGE_KEY.DETAILS).then(
      (d: MapElementDetailMap) => {
        this._locationData = d;
    });

    await loadData('faqs', LOCAL_STORAGE_KEY.FAQ).then((faqs: FaqMap) => {
      this._faqData = faqs;
    });

    this.appLoaded = true;
  }

  /**
   * Listen for and handle global `resize` events on the window.
   */
  @Listen('window:resize')
  handleResize() {
    this.appWidth = window.innerWidth;
  }

  /**
   * Listen for a `searchLocationClicked` event from the search bar. This occurs
   * when the user selects one of the locations from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  _onSearchLocationClicked(e: CustomEvent) {
    const viewMap = this.root.querySelector('.rl-view--map') as HTMLViewMapElement;
    // const router = this.root.querySelector('stencil-router') as HTMLStencilRouterElement;
    if (viewMap && viewMap.hasOwnProperty('setActiveElement')) {
      // Map is open. Set active element.
      viewMap.setActiveElement(this._locationData[e.detail]);
    } else {
      // Navigate to page and then set the active element.
      const loc = this._locationData[e.detail];

      // Hijack the current view to get the RouterHistory object.  It is only
      // available within the context of the stencil-router and its children.
      const view = this.root.querySelector('.rl-view') as any;
      view.history.push(`${BASE_URL}${ROUTES.DIRECTORY}/${loc.code}`);
    }
    console.log(e.detail);
  }

  /**
   * Listen for a `resultSelected` event from the search bar. This occurs when
   * the user selects one of the results from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  _onSearchFaqClicked(e: CustomEvent) {
    const viewMap = this.root.querySelector('.rl-view--map') as HTMLViewMapElement;
    if (viewMap && viewMap.hasOwnProperty('setActiveElement')) {
      viewMap.setActiveElement(this._locationData[e.detail]);
      // viewMap.setActiveElementByDetail(e.detail);
    } else {
      // Navigate to page and then set the active element.
    }
    console.log(e.detail);
  }

  /**
   * Dynamically sets host element attributes.
   */
  hostData() {
    return {
      class: {
        'rl-bis': true,
        'rl-bis--loaded': this.appLoaded,
      },
    };
  }

  /**
   * Component render function.
   */
  render() {
    return ([
      <rl-app-bar
          appTitle={APP_TITLE} appWidth={this.appWidth}
          onMenuClicked={_ => { this.drawerOpen = true; }}
          locationData={this._locationData}
          faqData={this._faqData}
          onSearchLocationClicked={e => this._onSearchLocationClicked(e)}
          onSearchFaqClicked={e => this._onSearchFaqClicked(e)}
        >
      </rl-app-bar>,

      <rl-drawer
          open={this.drawerOpen}
          onDrawerClose={_ => { this.drawerOpen = false; }}>
        <header class="rl-drawer__header">
          <div class="rl-drawer__header-content">
            <button class="material-icons mdc-top-app-bar__navigation-icon"
              aria-label="Close navigation menu.">close</button>
            <span class="mdc-top-app-bar__title">{APP_TITLE}</span>
          </div>
        </header>
        <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
          {this.appPages.map(page =>
            <stencil-route-link activeClass="mdc-list-item--activated"
                anchorClass="mdc-list-item" anchorTabIndex="0"
                url={`${BASE_URL}${page.url}`} exact={page.url === ''}>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                {page.icon}
              </i>
              {page.title}
            </stencil-route-link>
          )}
        </nav>
      </rl-drawer>,

      <main class="rl-main-content">
        <stencil-router id="router" titleSuffix={` | ${APP_TITLE}`}>
          <stencil-route-switch>
            <stencil-route component="view-map"
              url={[
                `${BASE_URL}${ROUTES.DIRECTORY}/:roomNo?`,
                `${BASE_URL}${ROUTES.DIRECTORY}`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: MAP_TYPE.DIRECTORY,
              }}>
            </stencil-route>
            <stencil-route component="view-map"
              url={[
                `${BASE_URL}books/map/:callNo`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: MAP_TYPE.BOOKS,
              }}>
            </stencil-route>
            <stencil-route component="view-map"
              url={[
                `${BASE_URL}${ROUTES.COMPUTERS}/`,
                `${BASE_URL}${ROUTES.COMPUTERS}`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: MAP_TYPE.COMPUTERS,
              }}>
            </stencil-route>
            <stencil-route component="view-building"
              url={[
                `${BASE_URL}${ROUTES.BUILDINGS}/`,
                `${BASE_URL}${ROUTES.BUILDINGS}`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route component="view-book"
              url={[
                `${BASE_URL}${ROUTES.BOOKS}/`,
                `${BASE_URL}${ROUTES.BOOKS}`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route component="view-event"
              url={[
                `${BASE_URL}${ROUTES.EVENTS}/`,
                `${BASE_URL}${ROUTES.EVENTS}`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route component="view-faq"
              url={[
                `${BASE_URL}${ROUTES.FAQS}/`,
                `${BASE_URL}${ROUTES.FAQS}`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route component="view-search"
              url={[`${BASE_URL}search/:query?`]}
              componentProps={{
                appLoaded: this.appLoaded,
              }}>
            </stencil-route>
            <stencil-route component="view-home" url={BASE_URL} exact
                componentProps={{
                  appLoaded: this.appLoaded,
                }}>
            </stencil-route>
            <stencil-route routeRender={() => ([
              <span>Undefined route</span>,
              <stencil-router-redirect url="/" />,
            ])}>
            </stencil-route>
          </stencil-route-switch>
        </stencil-router>
      </main>,
    ]);
  }
}
