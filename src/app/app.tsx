import '@ryersonlibrary/web-components';
import { Component, Element, Listen, State, h } from '@stencil/core';
import '@stencil/router';

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
  MapElementDetail,
  MapElementDetailMap,
  SearchResultItem,
} from '../interface';
import { dataService } from '../utils/data-service';
import { Search } from '../utils/search';

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

  private docSearch = new Search();

  private _locationData: MapElementDetailMap = {};
  private _faqData: FaqMap = {};
  @State() searchQuery = '';
  @State() resultHeight = 0;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLRlBisElement;

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

  /**
   * Global flag indicating if the whole application has loaded.
   */
  @State() loaded = false;

  /**
   * Lifecycle event fired after the component has rendered the first time.
   */
  async componentDidLoad() {
    dataService.listen(EVENTS.ALL_DATA_LOADED, () => {
      this._faqData = dataService.getData(APP_DATA.FAQS);

      Object.values(this._faqData).forEach((f: Faq) => {
        this.docSearch.addDocument(`f-${f.id}`, 'question_answer', f.question);
      });

      this._locationData = dataService.getData(APP_DATA.DETAILS);

      Object.values(this._locationData).forEach((d: MapElementDetail) => {
        this.docSearch.addDocument(`d-${d.id}`, 'location_on', `[${d.code}] ${d.name}`);
      });

      this.loaded = true;
    });
    dataService.initialize();
  }

  /**
   * Listen for and handle global `resize` events on the window.
   */
  @Listen('resize', { target: 'window' })
  handleResize() {
    this.appWidth = window.innerWidth;
  }

  _onSearchChange(e: Event) {
    const t = e.target;

    if (t !== null && t instanceof HTMLInputElement) {
      this.searchQuery = t.value;
      this.searchResults = this.docSearch.search(this.searchQuery, 6);
    }
  }

  /**
   * Listen for a `searchLocationClicked` event from the search bar. This occurs
   * when the user selects one of the locations from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  _onSearchLocationClicked(resultId) {
    const viewMap = this.root.querySelector('.rl-view--map') as HTMLViewMapElement;
    if (viewMap && viewMap.hasOwnProperty('setActiveElement')) {
      // Map is open. Set active element.
      viewMap.setActiveDetail(this._locationData[resultId].id);
    } else {
      // Navigate to page and then set the active element.
      const loc = this._locationData[resultId];

      // Hijack the current view to get the RouterHistory object.  It is only
      // available within the context of the stencil-router and its children.
      // tslint:disable-next-line: no-unnecessary-type-assertion
      const view = this.root.querySelector('.rl-view') as any;
      view.history.push(`${BASE_URL}${ROUTES.DIRECTORY}/${loc.code}`);
    }
  }

  /**
   * Listen for a `resultSelected` event from the search bar. This occurs when
   * the user selects one of the results from the search box.  The event
   * `detail` will contain a reference to the selected item.
   *
   * @param e The triggering event
   */
  _onSearchFaqClicked(resultId) {
    const viewFaq = this.root.querySelector('.rl-view--faq') as HTMLViewFaqElement;
    if (viewFaq && viewFaq.hasOwnProperty('setActiveFaq')) {
      viewFaq.setActiveFaq(resultId);
    } else {
      // Navigate to page and then set the active element.
      // tslint:disable-next-line: no-unnecessary-type-assertion
      const view = this.root.querySelector('.rl-view') as any;
      view.history.push(`${BASE_URL}${ROUTES.FAQS}/${resultId}`);
    }
  }

  @Listen('suggestionClicked')
  onSuggestionClicked(e: CustomEvent) {
    const resultID = e.detail.id as string;
    const [ type, id ] = resultID.split('-');

    switch (type) {
      case 'd':
        this._onSearchLocationClicked(Number(id));
        break;
      case 'f':
        this._onSearchFaqClicked(Number(id));
        break;
      default:
    }

    this.searchQuery = '';
    this.searchResults = [];
  }

  /**
   * Dynamically sets host element attributes.
   */
  hostData() {
    return {
      class: {
        'rl-bis': true,
        'rl-bis--loaded': this.loaded,
      },
    };
  }

  /**
   * Component render function.
   */
  render() {
    const { appPages, loaded } = this;

    if (loaded) {
      return ([
        <rl-app-bar
            type="fixed"
            onMenuClicked={_ => { this.drawerOpen = true; }}
            singleSection={this.appWidth < 500}
          >
          {this.appWidth < 500 ? undefined : (<div slot="title">{APP_TITLE}</div>)}
          <rl-search-box
            slot="centerSection"
            showMenu={this.appWidth < 500}
            placeholder={this.appWidth < 500 ? APP_TITLE : undefined}
            resultHeight={this.resultHeight}
            onIconClick={() => { this.drawerOpen = true; }}
            searchValue={this.searchQuery}
            docSearch={this.docSearch}
          >
          </rl-search-box>
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
            {appPages.map(page =>
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
                  appLoaded: loaded,
                  mapType: MAP_TYPE.DIRECTORY,
                }}>
              </stencil-route>
              <stencil-route component="view-map"
                url={[
                  `${BASE_URL}${ROUTES.BOOKS}/map/:callNo`,
                ]}
                componentProps={{
                  appLoaded: loaded,
                  mapType: MAP_TYPE.BOOKS,
                }}>
              </stencil-route>
              <stencil-route component="view-map"
                url={[
                  `${BASE_URL}${ROUTES.COMPUTERS}/:labNo?`,
                  `${BASE_URL}${ROUTES.COMPUTERS}`,
                ]}
                componentProps={{
                  appLoaded: loaded,
                  mapType: MAP_TYPE.COMPUTERS,
                }}>
              </stencil-route>
              <stencil-route component="view-building"
                url={[
                  `${BASE_URL}${ROUTES.BUILDINGS}/`,
                  `${BASE_URL}${ROUTES.BUILDINGS}`,
                ]}
                componentProps={{
                  appLoaded: loaded,
                }}>
              </stencil-route>
              <stencil-route component="view-book"
                url={[
                  `${BASE_URL}${ROUTES.BOOKS}/`,
                  `${BASE_URL}${ROUTES.BOOKS}`,
                ]}
                componentProps={{
                  appLoaded: loaded,
                }}>
              </stencil-route>
              <stencil-route component="view-event"
                url={[
                  `${BASE_URL}${ROUTES.EVENTS}/`,
                  `${BASE_URL}${ROUTES.EVENTS}`,
                ]}
                componentProps={{
                  appLoaded: loaded,
                }}>
              </stencil-route>
              <stencil-route component="view-faq"
                url={[
                  `${BASE_URL}${ROUTES.FAQS}/:faqId?`,
                  `${BASE_URL}${ROUTES.FAQS}`,
                ]}
                componentProps={{
                  appLoaded: loaded,
                }}>
              </stencil-route>
              <stencil-route component="view-search"
                url={[`${BASE_URL}${ROUTES.SEARCH}/:query?`]}
                componentProps={{
                  appLoaded: loaded,
                }}>
              </stencil-route>
              <stencil-route component="view-home" url={BASE_URL} exact
                  componentProps={{
                    appLoaded: loaded,
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
    } else {
      return undefined;
    }
  }
}
