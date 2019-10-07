import '@ryersonlibrary/web-components';
import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';
import '@stencil/router';
// tslint:disable-next-line:no-duplicate-imports
import { RouterHistory, injectHistory } from '@stencil/router';
import { UAParser } from 'ua-parser-js';

import { BASE_URL } from '../global/config';
import {
  APP_DATA,
  APP_TITLE,
  EVENTS,
  MAP_TYPE,
  ROUTES,
} from '../global/constants';
import {
  Faq,
  FaqMap,
  MapElement,
  MapElementMap,
  SearchResultItem,
} from '../interface';
import { dataService } from '../utils/data-service';
import { Search } from '../utils/search';

@Component({
  tag: 'rl-bis',
  styleUrl: 'app.scss',
})

export class RLApp {
  private isMobile = false;

  /**
   * Object containing all the pages used for the nav menu of the App.
   */
  private appRoutes = [
    {
      urls: [
        `${BASE_URL}${ROUTES.MAP}/:mapType?/:id?/:ref?`,
        `${BASE_URL}${ROUTES.MAP}`,
      ],
      component: 'view-map',
    },
    {
      urls: [
        `${BASE_URL}${ROUTES.BUILDINGS}/:bldName`,
        `${BASE_URL}${ROUTES.BUILDINGS}`,
      ],
      component: 'view-building',
    },
    {
      urls: [
        `${BASE_URL}${ROUTES.EVENTS}/`,
        `${BASE_URL}${ROUTES.EVENTS}`,
      ],
      component: 'view-event',
    },
    {
      urls: [
        `${BASE_URL}${ROUTES.FAQ}/:faqId?`,
        `${BASE_URL}${ROUTES.FAQS}`,
      ],
      component: 'view-faq',
    },
    {
      // Do not allow URLs with just the base search path (no query).
      urls: [
        `${BASE_URL}${ROUTES.SEARCH}/:query?`,
      ],
      component: 'view-search',
    },
    {
      urls: [`${BASE_URL}${ROUTES.HOME}`],
      component: 'view-home',
      exact: true,
      props: {},
    },
  ];

  private appLinks = [
    { title: 'Home', url: ROUTES.HOME, icon: 'home', exact: true },
    { title: 'Directory', url: `${ROUTES.MAP}/${MAP_TYPE.LOCN}`, icon: 'map' },
    { title: 'Books', url: `${ROUTES.MAP}/${MAP_TYPE.BOOK}`, icon: 'import_contacts' },
    { title: 'Computers', url: `${ROUTES.MAP}/${MAP_TYPE.COMP}`, icon: 'computer' },
    { title: 'Buildings', url: ROUTES.BUILDINGS, icon: 'business' },
    { title: 'Events', url: ROUTES.EVENTS, icon: 'event' },
    { title: 'FAQs', url: ROUTES.FAQS, icon: 'question_answer' },
  ];

  private docSearch = new Search();

  private _locationData: MapElementMap = {};
  private _faqData: FaqMap = {};
  private searchEl?: HTMLRlSearchBoxElement;

  @State() searchQuery = '';
  @State() resultHeight = 0;

  /**
   * Root element of this component.
   */
  @Element() root?: HTMLRlBisElement;

  @State() searchResults: SearchResultItem[] = [];

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

  @State() clusterColumns = 2;

  @Prop() history?: RouterHistory;

  /**
   * Lifecycle event fired after the component has rendered the first time.
   */
  componentWillLoad() {
    const dev = new UAParser().getDevice();
    this.isMobile = dev.type !== undefined && dev.type === 'mobile';

    dataService.listen(EVENTS.ALL_DATA_LOADED, () => {
      this._faqData = dataService.getData(APP_DATA.FAQS);

      Object.values(this._faqData).forEach((f: Faq) => {
        this.docSearch.addDocument(`f-${f.id}`, 'question_answer', f.question);
      });

      this._locationData = dataService.getData(APP_DATA.DETAILS);

      Object.values(this._locationData).forEach((d: MapElement) => {
        this.docSearch.addDocument(`d-${d.id}`, 'location_on', `[${d.code}] ${d.name}`);
      });

      // this.loaded = true;
    });
    dataService.initialize();
    this._updateClusterColumns();
  }

  /**
   * Listen for and handle global `resize` events on the window.
   */
  @Listen('resize', { target: 'window' })
  handleResize() {
    this._updateClusterColumns();
  }

  _updateClusterColumns() {
    const width = window.innerWidth - 128;
    this.clusterColumns =
      this.isMobile ? 2 :
        700 > width ? 3 :
          928 > width ? 4 :
            1160 > width ? 5 :
              1392 > width ? 6 :
                1624 > width ? 7 : 8;
  }

  _onSearchChange(e: Event) {
    const t = e.target;

    if (t !== null && t instanceof HTMLInputElement) {
      this.searchQuery = t.value;
      this.searchResults = this.docSearch.search(this.searchQuery, 6);
    }
  }

  @Listen('hashchange', { target: 'window' })
  async handleHashChanged() {
    if (this.searchEl) {
      await this.searchEl.clearInput();
    }
  }

  /**
   * Listen for a `searchLocationClicked` event from the search bar. This occurs
   * when the user selects one of the locations from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  async _onSearchLocationClicked(resultId) {
    const loc = this._locationData[resultId];

    if (this.history !== undefined) {
      this.history.push(`${BASE_URL}${ROUTES.MAP}/${MAP_TYPE.LOCN}/${loc.code}`);
    }
  }

  /**
   * Listen for a `resultSelected` event from the search bar. This occurs when
   * the user selects one of the results from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  async _onSearchFaqClicked(resultId) {
    if (this.history !== undefined) {
      this.history.push(`${BASE_URL}${ROUTES.FAQ}/${resultId}`);
    }
  }

  @Listen('suggestionClicked')
  async onSuggestionClicked(e: CustomEvent) {
    const resultID = e.detail.id as string;
    const [type, id] = resultID.split('-');

    switch (type) {
      case 'd':
        await this._onSearchLocationClicked(Number(id));
        break;
      case 'f':
        await this._onSearchFaqClicked(Number(id));
        break;
      default:
    }

    this.searchQuery = '';
    this.searchResults = [];
  }

  /**
   * Component render function.
   */
  render() {
    const { appLinks, appRoutes } = this;

    // if (loaded) {
    return (
      <Host class={{ 'rl-bis': true }}>
        <rl-app-bar
          type="fixed"
          onMenuClicked={_ => { this.drawerOpen = true; }}
          singleSection={this.isMobile}
        >
          {this.isMobile ? undefined : (<div slot="title">{APP_TITLE}</div>)}
          <rl-search-box
            ref={el => { this.searchEl = el; }}
            slot="centerSection"
            showMenu={this.isMobile}
            placeholder={this.isMobile ? APP_TITLE : undefined}
            resultHeight={this.resultHeight}
            onIconClick={() => { this.drawerOpen = true; }}
            searchValue={this.searchQuery}
            docSearch={this.docSearch}
          >
          </rl-search-box>
        </rl-app-bar>

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
            {appLinks.map(link =>
              <stencil-route-link activeClass="mdc-list-item--activated"
                anchorClass="mdc-list-item" anchorTabIndex="0"
                url={`${BASE_URL}${link.url}`} exact={link.exact}>
                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                  {link.icon}
                </i>
                {link.title}
              </stencil-route-link>
            )}
          </nav>
        </rl-drawer>

        <main id="main" class="rl-main-content">
          <stencil-router id="router" titleSuffix={APP_TITLE}>
            <stencil-route-switch>
              {appRoutes.map(route =>
                <stencil-route component={route.component}
                  url={route.urls}
                  componentProps={{
                    appLoaded: true,
                    isMobile: this.isMobile,
                    clusterColumns: this.clusterColumns,
                  }}
                >
                </stencil-route>
              )}
              <stencil-route routeRender={() => ([
                <span>Undefined route</span>,
                <stencil-router-redirect url={`${BASE_URL}${ROUTES.HOME}`} />,
              ])}>
              </stencil-route>
            </stencil-route-switch>
          </stencil-router>
        </main>
      </Host>
    );
    // } else {
    //   return (<Host class={{ 'rl-bis': true, 'rl-bis--loaded': this.loaded }} />);
    // }
  }
}

injectHistory(RLApp);
