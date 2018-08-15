import { MDCTemporaryDrawer } from '@material/drawer';
import { Component, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';

import { FOCUSABLE_ELEMENTS } from '../../global/constants';

@Component({
  tag: 'rula-drawer',
  styleUrl: 'drawer.scss',
  host: {
    theme: 'mdc-drawer mdc-drawer--temporary',
  },
})

export class RulaDrawer {

  private drawer: MDCTemporaryDrawer;

  /**
   * The first tabbable child element of this drawer.
   */
  private firstTabStop: HTMLElement;

  /**
   * The last tabbable child element of this drawer.
   */
  private lastTabStop: HTMLElement;

  /**
   * Flag indicating if a focus trap should be used to prevent the user from
   * tabbing outside the drawer.
   */
  private noFocusTrap = false;

  /**
   * The element that had focus when this drawer was opened.
   */
  private oldTabStop: HTMLElement;

  /**
   * Root element of this component.
   */
  @Element() root: HTMLElement;

  /**
   * Flag indicating if the drawer is open.
   */
  @Prop() open: boolean;
  @Watch('open')
  openDrawer() {
    this.drawer.open = this.open;
  }

  /**
   * An event emitted when this drawer closes.
   */
  @Event() drawerClose: EventEmitter;

  componentDidLoad() {
    this.drawer = new MDCTemporaryDrawer(this.root);
    this.drawer.listen('MDCTemporaryDrawer:close', () => {
      this.drawerClose.emit();
      this.oldTabStop.focus();
    });

    this.drawer.listen('MDCTemporaryDrawer:open', () => {
      if (!this.noFocusTrap) {
        this.setFocusTrap();
      }
    });

    const links = this.root.querySelectorAll(FOCUSABLE_ELEMENTS);
    Object.keys(links).map(key => {
      links[key].addEventListener('click', () => {
        this.drawer.open = false;
      });
    });
  }

  @Listen('keydown.tab')
  handleTab(ev: KeyboardEvent) {
    const TAB_KEYCODE = 9;
    if (this.drawer.open && ev.keyCode === TAB_KEYCODE) {
      if (ev.shiftKey) {
        if (this.firstTabStop && ev.target === this.firstTabStop) {
          ev.preventDefault();
          this.lastTabStop.focus();
        }
      } else {
        if (this.lastTabStop && ev.target === this.lastTabStop) {
          ev.preventDefault();
          this.firstTabStop.focus();
        }
      }
    }
  }

  setFocusTrap() {
    const focusableElements = this.root.querySelectorAll(FOCUSABLE_ELEMENTS);

    if (focusableElements.length > 0) {
      this.firstTabStop = focusableElements[0] as HTMLElement;
      this.lastTabStop = focusableElements[focusableElements.length - 1] as HTMLElement;
    } else {
      // Reset saved tab stops when there are no focusable elements in the card.
      this.firstTabStop = undefined;
      this.lastTabStop = undefined;
    }

    this.oldTabStop = document.activeElement as HTMLElement;
  }

  render() {
    return (
      <nav class="mdc-drawer__drawer">
        <slot />
      </nav>
    );
  }
}
