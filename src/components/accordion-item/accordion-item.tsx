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

import { ROUTES } from '../../global/constants';

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
  @Element() root!: HTMLRlAccordionItemElement;

  /**
   * Queue object used to schecule actions that are executed on animation frames.
   */
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

  /**
   * Event emitted after the body's expand animation has completed.
   */
  @Event() afterExpand!: EventEmitter;

  /**
   * Event emitted when the item is closed.
   */
  @Event() closed!: EventEmitter;

  /**
   * Event emitted when the item is opened.
   */
  @Event() opened!: EventEmitter;

  /**
   * Lifecycle event fired when the component has finished loading and is
   * rendered into the DOM.
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
   * Lifecycle event fired when part of the component (or child components)
   * has updated and the changes have been rendered.
   */
  componentDidUpdate() {
    const btn = this.root.querySelector('.rl-accordion-item__trigger') as HTMLButtonElement;

    if (btn && this.isOpen) {
      btn.focus();
    }
  }

  /**
   * Close the `accordion-item`.
   */
  @Method()
  async close() {
    this.isOpen = false;
  }

  /**
   * Open the `accordion-item`.
   */
  @Method()
  async open() {
    this.updateHeight();
    this.isOpen = true;
  }

  @Listen('transitionend')
  /**
   * Handle when a transition has finished and the after transition events
   * need to be fired.
   */
  onTransitionEnd(evt: TransitionEvent) {
    // Ignore transition events for other properties (like opacity and margin).
    if (evt.propertyName === 'height') {
      this.isOpen ? this.afterExpand.emit() : this.afterCollapse.emit();
    }
  }

  /**
   * Function that is called to re-calculate how tall the item content should
   * be when open.  Will call itself again until its height is non-zero.  A zero
   * height occurs if the component is a child of an element that has is set to
   * `display: none`.  This can occur when using `stencil-router` and switching
   * routes.
   */
  updateHeight() {
    const slot = this.root.querySelector('[slot="content"]') as HTMLElement;
    this.contentHeight = slot && slot.offsetHeight;

    /**
     * Loop (on animation frame) until a non-zero height is found or the item
     * is closed again.
     */
    if (slot.hasChildNodes && this.contentHeight === 0 || !this.isOpen) {
      this.queue.write(() => {
        this.updateHeight();
      });
    }
  }

  /**
   * Toggles the current state of the `accordion-item`.
   */
  toggle() {
    this.isOpen = !this.isOpen;
    this.isOpen ? this.opened.emit() : this.closed.emit();
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
      >
        <stencil-route-link
          anchorClass="rl-accordion-item__trigger"
          aria-controls={`rl-accordion-item__content-${this.index}`}
          url={`${ROUTES.FAQS}/${this.index}`}
          custom="button"
        >
          <span class="rl-accordion-item__title">
            <slot name="header" />
          </span>
          <span class="rl-accordion-item__icon material-icons"
              aria-hidden="true">
            expand_more
          </span>
        </stencil-route-link>
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
