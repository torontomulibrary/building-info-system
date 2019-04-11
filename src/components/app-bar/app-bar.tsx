import { MDCTopAppBar } from '@material/top-app-bar/index';
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';

// import { FaqMap, MapElementDetailMap } from '../../interface';

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
  // @Prop() appWidth = 0;

  @Prop() appTitle = '';

  // @Prop() locationData!: MapElementDetailMap;
  // @Prop() faqData!: FaqMap;

  @Prop() type: 'fixed' | 'prominent' | 'short' | 'shortCollapsed' | 'prominentFixed' | '' = '';

  @Prop() dense = false;
  @Prop() centerTitle = false;
  @Prop() singleSection = false;

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

  renderSingleSection() {
    return(
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-middle">
        <slot name="centerSection" />
      </section>
    );
  }

  renderFullBar() {
    const { centerTitle } = this;

    const titleDom = (
      <span class="mdc-top-app-bar__title">
        <slot name="title" />
      </span>
    );

    return ([
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <button class="material-icons mdc-top-app-bar__navigation-icon"
            aria-label="Open navigation menu."
            onClick={_ => this.menuClicked.emit() }>
          menu
        </button>
        {!centerTitle ? titleDom : undefined}
      </section>,
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-middle">
        {centerTitle ? titleDom : undefined}
        <slot name="centerSection" />
      </section>,
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
        <slot name="actionItems" />
      </section>,
    ]);
  }

  hostData() {
    const { centerTitle, dense, type } = this;
    return {
      class: {
        'mdc-top-app-bar': true,
        'mdc-top-app-bar--fixed': type === 'fixed' || type === 'prominentFixed',
        'mdc-top-app-bar--short': type === 'shortCollapsed' || type === 'short',
        'mdc-top-app-bar--short-collapsed': type === 'shortCollapsed',
        'mdc-top-app-bar--prominent': type === 'prominent' || type === 'prominentFixed',
        'mdc-top-app-bar--dense': dense,
        'mdc-top-app-bar--center-title': centerTitle,
      },
      role: 'banner',
    };
  }

  render() {
    return (
      <div class="mdc-top-app-bar__row">
        {this.singleSection ? this.renderSingleSection() : this.renderFullBar() }
      </div>
    );
  }
}
