import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  State,
} from '@stencil/core';
import { FocusTrap } from 'focus-trap';

import * as util from './util';

@Component({
  tag: 'rula-side-sheet',
  styleUrl: 'side-sheet.scss',
})

/**
 * A component that works similarly to the Material Side Sheet.  Provides a
 * surface to hold supplementary content anchored to the left or right edge
 * of the screen.
 */
export class SideSheet {
  /**
   * Object used to trap user focus when this sheet is open.
   */
  private focusTrap!: FocusTrap;

  /**
   * The element that has focus when this detail panel is opened.
   */
  private previousFocus!: Element | null;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

  /**
   * Flag indicating if this `sheet` is current opening or closing.
   */
  @State() isAnimating = false;

  /**
   * Flag indicating if this `sheet` is open and visible.
   */
  @State() isOpen = false;

  /**
   * Event fired when the `side-sheet` has finished closing.
   */
  @Event() closed!: EventEmitter;

  /**
   * Event fired when the `side-sheet` has finished opening.
   */
  @Event() opened!: EventEmitter;

  /**
   * Lifecycle method called when the component has entered the DOM and has
   * rendered the first time.
   */
  componentDidLoad() {
    this.focusTrap = util.createFocusTrapInstance(this.root);
  }

  @Listen('keydown')
  /**
   * Closes the sheet if `ESC` is pressed when open.
   */
  handleKeydown(evt: KeyboardEvent) {
    const { keyCode, key } = evt;
    const isEscape = key === 'Escape' || keyCode === 27;

    if (isEscape) {
      this.close();
    }
  }

  @Listen('transitionend')
  /**
   * Handles `transitionend` events.
   */
  handleTransitionEnd(evt: Event) {
    if (!(evt.target instanceof HTMLElement) ||
        !evt.target.classList.contains('rula-side-sheet')) {
      return;
    }

    if (!this.isOpen) {
      this.focusTrap.deactivate();
      this.closed.emit();

      if (this.root.contains(document.activeElement) &&
          this.previousFocus && this.previousFocus.hasOwnProperty('focus') &&
          this.previousFocus instanceof HTMLElement) {
        this.previousFocus.focus();
      }
    } else {
      // TODO: Add support for pre-activated item to get focus.
      // const activeItem = this.root.querySelector('rula-side-sheet')
      this.focusTrap.activate();
      this.opened.emit();
    }

    this.isAnimating = false;
  }

  @Method()
  /**
   * Opens the sheet if not already open or opening.
   */
  open() {
    if (this.isOpen || this.isAnimating) {
      return;
    }

    this.previousFocus = document.activeElement;
    this.isAnimating = true;
    this.isOpen = true;
  }

  @Method()
  /**
   * Closes the sheet if not already closed or closing.
   */
  close() {
    if (!this.isOpen || this.isAnimating) {
      return;
    }

    this.isAnimating = true;
    this.isOpen = false;
  }

  /**
   * Updates host element attributes.
   */
  hostData() {
    return {
      class: {
        'rula-side-sheet': true,
        'rula-side-sheet--open': this.isOpen,
        'rula-side-sheet--animate': this.isAnimating,
      },
    };
  }

  /**
   * Renders the component.
   */
  render() {
    return (
      <slot />
    );
  }
}
