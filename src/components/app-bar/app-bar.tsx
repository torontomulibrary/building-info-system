import { MDCTopAppBar } from '@material/top-app-bar/index';
import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'rl-app-bar',
  styleUrl: 'app-bar.scss',
})
export class AppBar {
  /**
   * @emits resultSelected
   */

  private mdcAppBar!: MDCTopAppBar;

  @Element() root!: HTMLRlAppBarElement;

  /**
   * The type of this `app-bar` used to determine style and function.
   */
  @Prop() type: 'fixed' | 'prominent' | 'short' | 'shortCollapsed' | 'prominentFixed' | '' = '';

  /**
   * Use dense bar styling (reduced height).
   */
  @Prop() dense = false;

  /**
   * Center the title within the `app-bar`.
   */
  @Prop() centerTitle = false;

  /**
   * Use one single section to hold all buttons and the title rather than three
   * distinc sections.
   */
  @Prop() singleSection = false;

  /**
   * Event fired when the menu button on the app bar is clicked.
   */
  @Event() menuClicked!: EventEmitter;

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

  render() {
    const { centerTitle, dense, type } = this;
    const rootClass = {
      'mdc-top-app-bar': true,
      'mdc-top-app-bar--fixed': type === 'fixed' || type === 'prominentFixed',
      'mdc-top-app-bar--short': type === 'shortCollapsed' || type === 'short',
      'mdc-top-app-bar--short-collapsed': type === 'shortCollapsed',
      'mdc-top-app-bar--prominent': type === 'prominent' || type === 'prominentFixed',
      'mdc-top-app-bar--dense': dense,
      'mdc-top-app-bar--center-title': centerTitle,
    };

    return (
      <Host role="banner" class={rootClass}>
        <div class="mdc-top-app-bar__row">
          {this.singleSection ? this.renderSingleSection() : this.renderFullBar() }
        </div>
      </Host>
    );
  }
}
