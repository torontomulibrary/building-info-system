import { MDCTopAppBar } from '@material/top-app-bar/index';
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';

import { FaqMap, MapElementDetailMap } from '../../interface';

@Component({
  tag: 'rl-app-bar',
  styleUrl: 'app-bar.scss',
})
export class AppBar {
  /**
   * @emits resultSelected
   */

  private mdcAppBar!: MDCTopAppBar;

  @Element() root!: HTMLStencilElement;

  /**
   * The current width of the application.  Used to determine what kind of
   * interface should be displayed (reduced or full-width layout).
   */
  @Prop() appWidth = 0;

  @Prop() appTitle = '';

  @Prop() locationData!: MapElementDetailMap;
  @Prop() faqData!: FaqMap;

  /**
   * Event fired when the menu button on the app bar is clicked.
   */
  @Event() menuClicked!: EventEmitter;

  @Event() searchLocationClicked!: EventEmitter;
  @Event() searchFaqClicked!: EventEmitter;

  componentDidLoad() {
    this.mdcAppBar = new MDCTopAppBar(this.root);
    this.mdcAppBar.initialize();
  }

  renderCompactBar() {
    return(
      <section class="mdc-top-app-bar__section">
        <rl-search-box show-menu
          locationData={this.locationData}
          faqData={this.faqData}
          onIconClick={_ => this.menuClicked.emit() }
          onLocationSelected={(e: CustomEvent) => this.searchLocationClicked.emit(e.detail)}
          onFaqSelected={(e: CustomEvent) => this.searchFaqClicked.emit(e.detail)}
        ></rl-search-box>
      </section>
    );
  }

  renderFullBar() {
    return ([
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <button class="material-icons mdc-top-app-bar__navigation-icon"
            aria-label="Open navigation menu."
            onClick={_ => this.menuClicked.emit() }>
          menu
        </button>
        <span class="mdc-top-app-bar__title">{this.appTitle}</span>
      </section>,
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-middle">
        <rl-search-box
          faqData={this.faqData}
          locationData={this.locationData}
          onLocationSelected={(e: CustomEvent) => this.searchLocationClicked.emit(e.detail)}
          onFaqSelected={(e: CustomEvent) => this.searchFaqClicked.emit(e.detail)}
        >
        </rl-search-box>
      </section>,
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"></section>,
    ]);
  }

  hostData() {
    return {
      class: {
        'mdc-top-app-bar mdc-top-app-bar--fixed': true,
      },
      role: 'banner',
    };
  }

  render() {
    return (
      <div class="mdc-top-app-bar__row">
        {this.appWidth < 500 ? this.renderCompactBar() : this.renderFullBar() }
      </div>
    );
  }
}
