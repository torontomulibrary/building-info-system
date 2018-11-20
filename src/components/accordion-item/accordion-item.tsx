import { MDCRipple } from '@material/ripple/index';
import { Component, Element, Event, EventEmitter, Method, Prop, State } from '@stencil/core';

/**
 * A component used in tandem with `rula-accordion` and represents a single item
 * of an accordion list.  A single `accordion-item` has header and content
 * sections.  The header is always visible and when the item is expanded, the
 * content is made visible.
 */
@Component({
  tag: 'rula-accordion-item',
  styleUrl: 'accordion-item.scss',
})

export class AccordionItem {
  /**
   * The button used as the header, and allows the user to toggle the open
   * state of the item.
   */
  private _button!: HTMLElement | null;

  /**
   * The root element of this component.
   */
  @Element() root!: HTMLElement;

  /**
   * A state tracking the current open/closed state of this item.
   */
  @State() isOpen = false;

  /**
   * A delay used to fade-in this item a specific amount of time after the
   * component is rendered.
   */
  @Prop() delay = 0;

  /**
   * An index number used to reference this item in the larger list of all
   * items in the parent accordion.
   */
  @Prop() index = 0;

  /**
   * An event that is emitted when this item changes its open/closed state.
   */
  @Event() toggleItem!: EventEmitter;

  /**
   * Component lifecycle function that is called when completely lodaded and
   * entered into the DOM.
   */
  componentDidLoad() {
    this._button = this.root.querySelector('#rula-accordion-item__trigger-' + this.index);

    if (this._button) {
      MDCRipple.attachTo(this._button);
    }

    window.setTimeout(() => {
      this.root.classList.remove('rula-accordion-item--fade-in');
    }, this.delay);
  }

  /**
   * Handes when an `enter` key is pressed on this component.
   * @param e The triggering event
   */
  onKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.toggle();
    }
  }

  /**
   * This function closes this item.
   */
  @Method()
  close() {
    this.isOpen = false;
  }

  /**
   * This function opens this item.
   */
  @Method()
  open() {
    this.isOpen = true;
  }

  /**
   * Toggles the current state of this item.
   */
  toggle() {
    this.isOpen = !this.isOpen;
    this.toggleItem.emit();
  }

  /**
   * Component function used to dynamically update any element attributes.
   */
  hostData() {
    return {
      'aria-expanded': this.isOpen,
      class: {
        'rula-accordion-item': true,
        'rula-accordion-item--open': this.isOpen,
      },
    };
  }

  /**
   * Component render function.
   */
  render() {
    return ([
      <dt role="heading" aria-level="3" class="rula-accordion-item__header"
          onClick={_ => { this.toggle(); }}>
        <button aria-expanded={this.open} id={`rula-accordion-item__trigger-${this.index}`}
            class="rula-accordion-item__trigger" type="button"
            onKeyPress={e => { this.onKeyPress(e); }}
            aria-controls={`rula-accordion-item__content-${this.index}`}>
          <span class="rula-accordion-item__title">
            <slot name="header" />
          </span>
          <span class="rula-accordion-item__icon material-icons"
              aria-hidden="true">
            expand_more
          </span>
        </button>
      </dt>,
      <dd id={`rula-accordion-item__content-${this.index}`} role="region"
          aria-hidden={!this.isOpen}
          aria-labelledby={`rula-accordion-item__trigger-${this.index}`}
          class="rula-accordion-item__content">
        <slot name="content" />
      </dd>,
    ]);
  }
}
