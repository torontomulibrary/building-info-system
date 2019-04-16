import { MDCDrawer } from '@material/drawer/index';
import { Component, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';

import { FOCUSABLE_ELEMENTS } from '../../global/constants';

@Component({
  tag: 'rl-drawer',
  styleUrl: 'drawer.scss',
})

export class RLDrawer {

  private drawer!: MDCDrawer;

  /**
   * The first tabbable child element of this drawer.
   */
  private firstTabStop?: HTMLElement;

  /**
   * The last tabbable child element of this drawer.
   */
  private lastTabStop?: HTMLElement;

  /**
   * Flag indicating if a focus trap should be used to prevent the user from
   * tabbing outside the drawer.
   */
  private noFocusTrap = false;

  /**
   * The element that had focus when this drawer was opened.
   */
  private oldTabStop!: HTMLElement;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLElement;

  /**
   * Flag indicating if the drawer is open.
   */
  @Prop() open!: boolean;
  @Watch('open')
  openDrawer() {
    this.drawer.open = this.open;
  }

  /**
   * An event emitted when this drawer closes.
   */
  @Event() drawerClose!: EventEmitter;

  componentDidLoad() {
    const el = this.root.querySelector('.mdc-drawer');
    if (el) {
      this.drawer = MDCDrawer.attachTo(el);
      this.drawer.listen('MDCDrawer:closed', () => {
        this.drawerClose.emit();
        this.oldTabStop.focus();
      });

      this.drawer.listen('MDCDrawer:opened', () => {
        if (!this.noFocusTrap) {
          this.setFocusTrap();
        }
      });

      const links = this.root.querySelectorAll(FOCUSABLE_ELEMENTS);
      Object.keys(links).map(key => {
        links[Number(key)].addEventListener('click', () => {
          this.drawer.open = false;
        });
      });
    }
  }

  @Listen('keydown.tab')
  handleTab(ev: KeyboardEvent) {
    const TAB_KEYCODE = '9';
    if (this.drawer.open && ev.key === TAB_KEYCODE) {
      if (ev.shiftKey) {
        if (this.firstTabStop && ev.target === this.firstTabStop) {
          ev.preventDefault();
          if (this.lastTabStop) {
            this.lastTabStop.focus();
          }
        }
      } else {
        if (this.lastTabStop && ev.target === this.lastTabStop) {
          ev.preventDefault();
          if (this.firstTabStop) {
            this.firstTabStop.focus();
          }
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

  hostData() {
    return {
      role: 'aisde',
    };
  }

  render() {
    return ([
      <div class="mdc-drawer mdc-drawer--modal">
        <aside class="mdc-drawer__drawer" role="navigation">
          <slot />
        </aside>
      </div>,
      <div class="mdc-drawer-scrim"></div>,
    ]);
  }
}
