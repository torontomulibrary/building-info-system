import { MDCTopAppBar } from '@material/top-app-bar';
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';

import { MapElementDetailMap } from '../../interface';

@Component({
  tag: 'rula-app-bar',
  styleUrl: 'app-bar.scss',
  host: {
    theme: 'mdc-top-app-bar mdc-top-app-bar--fixed',
    role: 'banner',
  },
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

  @Prop() searchData!: MapElementDetailMap;

  /**
   * Event fired when the menu button on the app bar is clicked.
   */
  @Event() menuClicked!: EventEmitter;

  componentDidLoad() {
    this.mdcAppBar = new MDCTopAppBar(this.root);
    this.mdcAppBar.initialize();
  }

  renderFullBar() {
    return(
      <section class="mdc-top-app-bar__section">
        <rula-search-box show-menu
          searchData={this.searchData}
          onIconClick={_ => this.menuClicked.emit() }></rula-search-box>
      </section>
    );
  }

  renderCompactBar() {
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
        <rula-search-box
          searchData={this.searchData}>
        </rula-search-box>
      </section>,
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"></section>,
    ]);
  }

  render() {
    return (
      <div class="mdc-top-app-bar__row">
        {this.appWidth < 500 ? this.renderCompactBar() : this.renderFullBar() }
      </div>
    );
  }
}
