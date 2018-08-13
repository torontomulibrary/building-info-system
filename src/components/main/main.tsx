import { Component, Element, Prop, State } from '@stencil/core';
import { MDCTopAppBar } from '@material/top-app-bar';
// import { MDCTextField } from '@material/textfield';
import { LazyStore } from '../../interface';
import '@rula/web-components';

import { updateDrawerState } from '../../actions/app';

import app from '../../reducers/app';

@Component({
  tag: 'rula-bis',
  styleUrl: 'main.scss'
})
export class Main {
  /**
   * Callback function used to unsubscribe from the Redux store.
   */
  private storeUnsubscribe: Function;
  // private topBar: MDCTopAppBar;
  // private search: MDCTextField;

  /**
   * Root element of this component.
   */
  @Element() root: HTMLStencilElement;

  /**
   * Flag indicating if the side drawer is open.
   */
  @State() drawerOpened: boolean;
  // @State() _page: string;

  /**
   * The global Redux store.
   */
  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  /**
   * A URL used to access when loading data.
   */
  @Prop() apiUrl: string;

  componentWillLoad() {
    this.lazyStore.addReducers({app});
    this.storeUnsubscribe = this.lazyStore.subscribe(() => 
      this.stateChanged(this.lazyStore.getState())
    );
  }

  componentDidLoad() {
    // For now, nothing is done with TopAppBar, don't need to save it.
    // this.topBar = 
    new MDCTopAppBar(this.root.querySelector('.rula-app-bar'));
    //this.search = new MDCTextField(this.root.querySelector('.mdc-text-field'));
  }

  componentDidUnload() {
    this.storeUnsubscribe();
  }

  stateChanged(state) {
    this.drawerOpened = state.app.drawerOpened;
  }

  render() {
    return ([
      <header class='rula-app-bar'>
        <div class='rula-app-bar__row'>
          <section class='rula-app-bar__section rula-app-bar__section--align-start'>
            <button class='material-icons rula-app-bar__navigation-icon' onClick={_ => this.lazyStore.dispatch(updateDrawerState(true))}>menu</button>
            <span class='rula-app-bar__title'>RULA Finder</span>
          </section>
        </div>
      </header>,

      <rula-drawer open={this.drawerOpened} onDrawerClose={_ => this.lazyStore.dispatch(updateDrawerState(false))}>
        <header class='rula-drawer__header'>
          <div class='rula-drawer__header-content'>
            <button class='material-icons rula-app-bar__navigation-icon'>close</button>
            <span class='rula-app-bar__title'>RULA Finder</span>
          </div>
        </header>
        <nav id='icon-with-text-demo' class='mdc-drawer__content mdc-list'>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/' exact>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>home</i>Home
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/map'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>map</i>Directory
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/building'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>business</i>Building Info
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/event'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>event</i>Events
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/faq'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>question_answer</i>FAQs
          </stencil-route-link>
        </nav>
      </rula-drawer>,

      <main class="rula-main-content">
        <stencil-router id="router">
          <stencil-route-switch>
            <stencil-route url="/" component='view-home' exact={true}></stencil-route>
            <stencil-route
              url={['/building', '/building/']}
              component='view-building'>
            </stencil-route>
            <stencil-route url={['/event', '/event/']} component='view-event'></stencil-route>
            <stencil-route
              url={['/faq', '/faq/']}
              component='view-faq'
              componentProps={{apiUrl: this.apiUrl}}>
            </stencil-route>
            <stencil-route
              url={['/map/:query?', '/map']}
              component='view-map'
              componentProps={{apiUrl: this.apiUrl}}>
            </stencil-route>
          </stencil-route-switch>
        </stencil-router>
      </main>
    ]);
  }
}
