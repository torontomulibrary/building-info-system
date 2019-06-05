import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { FocusTrap } from 'focus-trap';

import * as util from './util';

@Component({
  tag: 'rl-side-sheet',
  styleUrl: 'side-sheet.scss',
})

/**
 * A component that works similarly to the Material Side Sheet.  Provides a
 * surface to hold supplementary content anchored to the left or right edge
 * of the screen.
 */
export class SideSheet {
  private _oldFocus!: HTMLElement | null;

  /**
   * Object used to trap user focus when this sheet is open.
   */
  private _focusTrap!: FocusTrap;

  /**
   * The element that has focus when this detail panel is opened.
   */
  private _previousFocus!: Element | null;

  /**
   * Root element of this component.
   */
  @Element() _root!: HTMLRlSideSheetElement;

  /**
   * Flag indicating if this `sheet` is current opening or closing.
   */
  @State() _isAnimating = false;

  /**
   * Flag indicating if this `sheet` is open and visible.
   */
  @State() _isOpen = false;

  @Prop({ mutable: true }) open = false;
  @Watch('open')
  onOpenChange() {
    if (this._isAnimating || this.open === this._isOpen) {
      return;
    }

    if (this.open) {
      this._previousFocus = document.activeElement;
    }

    this._isAnimating = true;
    this._isOpen = this.open;
  }

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
    this._focusTrap = util.createFocusTrapInstance(this._root);
    this.onOpenChange();

    // Hack-y workaround since if initially open, does not animate and does not
    // fire `transitionend` event.
    this._isAnimating = false;
  }

  @Listen('keydown')
  /**
   * Closes the sheet if `ESC` is pressed when open.
   */
  handleKeydown(evt: KeyboardEvent) {
    const { keyCode, key } = evt;
    const isEscape = key === 'Escape' || keyCode === 27;

    if (isEscape) {
      this.open = false;
    }
  }

  @Listen('transitionend')
  /**
   * Handles `transitionend` events.
   */
  handleTransitionEnd(evt: Event) {
    if (!(evt.target instanceof HTMLElement) ||
        !evt.target.classList.contains('rl-side-sheet')) {
      return;
    }

    if (!this._isOpen) {
      this._focusTrap.deactivate();
      if (this._oldFocus) {
        this._oldFocus.focus();
      }
      this.closed.emit();

      if (this._root.contains(document.activeElement) &&
          this._previousFocus && this._previousFocus.hasOwnProperty('focus') &&
          this._previousFocus instanceof HTMLElement) {
        this._previousFocus.focus();
      }
    } else {
      // TODO: Add support for pre-activated item to get focus.
      // const activeItem = this._root.querySelector('rl-side-sheet')
      this._oldFocus = document.activeElement as HTMLElement;
      this._focusTrap.activate();
      this.opened.emit();
    }

    this._isAnimating = false;
  }

  /**
   * Updates host element attributes.
   */
  hostData() {
    return {
      class: {
        'rl-side-sheet': true,
        'rl-side-sheet--open': this._isOpen,
        'rl-side-sheet--animate': this._isAnimating,
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
