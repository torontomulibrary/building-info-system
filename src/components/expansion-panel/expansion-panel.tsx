import { MDCRipple } from '@material/ripple/index';
import { Component, Element, Event, EventEmitter, Method, Prop, State } from '@stencil/core';

/**
 * A component providing an element with header and content where the header
 * is always visible and the content can be expanded and collapsed when a
 * button in the header is clicked.
 */
@Component({
    tag: 'rl-expansion-panel',
    styleUrl: 'expansion-panel.scss',
})
export class RLExpansionPanel {
  /**
   * The button used as the header, and allows the user to toggle the open
   * state of the item.
   */
  private _button?: HTMLButtonElement;

  @State() isOpen = false;

  @Prop() index = 0;

  @Event() toggled!: EventEmitter;
  /**
   * The root element of this component.
   */
  @Element() root!: HTMLElement;

  componentDidLoad() {
    if (this._button) {
      MDCRipple.attachTo(this._button);
    }
  }

  @Method()
  close() {
    this.isOpen = false;
  }

  @Method()
  open() {
    this.isOpen = true;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.toggled.emit();
  }

  hostData() {
    return {
      class: {
        'rl-expansion-panel': true,
        'rl-expansion-panel--open': this.isOpen,
      },
    };
  }

  render() {
    return ([
      <dt class="rl-expansion-panel__header" onClick={_ => { this.toggle(); }}>
        <button aria-expanded={this.isOpen ? 'true' : 'false'}
            ref={el => this._button = el}
            id={`rl-expansion-panel__trigger-${this.index}`}
            class="rl-expansion-panel__trigger"
            aria-controls={`rl-expansion-panel__content-${this.index}`}>
          <span class="rl-expansion-panel__title">
            <slot name="header" />
          </span>
          <span class="rl-expansion-panel__icon material-icons"
              aria-hidden="true">
            expand_more
          </span>
        </button>
      </dt>,
      <dd id={`rl-expansion-panel__content-${this.index}`}
          class="rl-expansion-panel__content">
        <slot name="content" />
      </dd>,
    ]);
  }
}
