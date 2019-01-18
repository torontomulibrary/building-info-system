import '@ryersonlibrary/web-components';
import { Component, Element, Listen, State } from '@stencil/core';

import { BASE_URL } from '../global/config';
import {
  APP_TITLE,
  ROUTES,
} from '../global/constants';

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
      url: BASE_URL,
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
  componentDidLoad() {
    const el = document.getElementById('splash-screen');
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }

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
   * Listen for a `resultSelected` event from the search bar. This occurs when
   * the user selects one of the results from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  @Listen('resultSelected')
  _onResultSelected(e: CustomEvent) {
    const viewMap = this.root.querySelector('.rl-view--map') as HTMLViewMapElement;
    if (viewMap && viewMap.hasOwnProperty('setActiveElementByDetail')) {
      // viewMap.setActiveElementByDetail(e.detail);
      console.log(e.detail);
    }
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
          searchData={{}}>
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
                mapType: 'directory',
              }}>
            </stencil-route>
            <stencil-route component="view-map"
              url={[
                `${BASE_URL}books/map/:callNo`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: 'book',
              }}>
            </stencil-route>
            <stencil-route component="view-map"
              url={[
                `${BASE_URL}${ROUTES.COMPUTERS}/`,
                `${BASE_URL}${ROUTES.COMPUTERS}`,
              ]}
              componentProps={{
                appLoaded: this.appLoaded,
                mapType: 'computer',
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
