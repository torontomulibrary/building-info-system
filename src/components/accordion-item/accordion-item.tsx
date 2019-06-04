import { MDCRipple } from '@material/ripple/index';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';

/**
 * A component used in tandem with `rl-accordion` and represents a single item
 * of an accordion list.  A single `accordion-item` has header and content
 * sections.  The header is always visible and when the item is expanded, the
 * content is made visible.
 */
@Component({
  tag: 'rl-accordion-item',
  styleUrl: 'accordion-item.scss',
})

export class AccordionItem {
  /**
   * The button used as the header, and allows the user to toggle the open
   * state of the item.
   */
  private _button?: HTMLButtonElement;

  /**
   * The height of the content element (slot).
   */
  @State() contentHeight = 0;

  /**
   * The root element of this component.
   */
  @Element() root!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  /**
   * A state tracking the current open/closed state of this item.
   */
  @Prop({ mutable: true }) isOpen = false;

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
   * Event emitted after the body's collapse animation has completed.
   */
  @Event() afterCollapse!: EventEmitter;
  @Event() afterExpand!: EventEmitter;
  @Event() closed!: EventEmitter;
  @Event() opened!: EventEmitter;

  /**
   * Component lifecycle function that is called when completely lodaded and
   * entered into the DOM.
   */
  componentDidLoad() {
    if (this._button) {
      MDCRipple.attachTo(this._button);
    }

    window.setTimeout(() => {
      this.root.classList.remove('rl-accordion-item--fade-in');
    }, this.delay);

    this.updateHeight();
  }

  /**
   * This function closes this item.
   */
  @Method()
  async close() {
    this.isOpen = false;
  }

  /**
   * This function opens this item.
   */
  @Method()
  async open() {
    this.updateHeight();
    this.isOpen = true;
  }

  @Listen('transitionend')
  onTransitionEnd(evt: TransitionEvent) {
    // Ignore transition events for other properties (like opacity and margin).
    if (evt.propertyName === 'height') {
      this.isOpen ? this.afterExpand.emit() : this.afterCollapse.emit();
    }
  }

  updateHeight() {
    const slot = this.root.querySelector('[slot="content"]') as HTMLElement;
    this.contentHeight = slot && slot.offsetHeight;

    if (slot.hasChildNodes && this.contentHeight === 0) {
      // When this component is a child of a `stencil-router`, the component may
      // 'render' but the route may still be display:none, making the height 0.
      // So begin a RAF loop that keeps calling until this component is in the
      // DOM with a non-zero height.  Don't bother with this if the slot doesn't
      // have any actual content, zero height then makes sense!
      this.queue.write(() => {
        this.updateHeight();
      });
    }
  }

  /**
   * Toggles the current state of this item.
   */
  toggle() {
    this.isOpen = !this.isOpen;
    this.isOpen ? this.opened.emit() : this.closed.emit();
  }

  @Method()
  async focusTitle() {
    if (this._button !== undefined) {
      this._button.focus();
    }
  }

  /**
   * Component function used to dynamically update any element attributes.
   */
  hostData() {
    return {
      class: {
        'rl-accordion-item': true,
        'rl-accordion-item--open': this.isOpen,
      },
    };
  }

  /**
   * Component render function.
   */
  render() {
    return ([
      <dt role="heading" aria-level="2" class="rl-accordion-item__header"
          onClick={_ => { this.toggle(); }}
      >
        <button aria-expanded={this.isOpen ? 'true' : 'false'}
            ref={el => this._button = el}
            id={`rl-accordion-item__trigger-${this.index}`}
            class="rl-accordion-item__trigger"
            aria-controls={`rl-accordion-item__content-${this.index}`}
        >
          <span class="rl-accordion-item__title">
            <slot name="header" />
          </span>
          <span class="rl-accordion-item__icon material-icons"
              aria-hidden="true">
            expand_more
          </span>
        </button>
      </dt>,
      <dd id={`rl-accordion-item__content-${this.index}`} role="region"
          aria-hidden={!this.isOpen}
          class="rl-accordion-item__content"
          tabindex={this.isOpen ? '0' : '-1'}
          style={{ height: `${this.isOpen ? this.contentHeight : 0}px` }}
      >
        <slot name="content" />
      </dd>,
    ]);
  }
}
