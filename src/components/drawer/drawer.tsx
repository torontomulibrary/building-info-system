import { Element, Event, EventEmitter, Prop, Listen, Watch, Component } from '@stencil/core';
import { MDCTemporaryDrawer, MDCTemporaryDrawerFoundation } from '@material/drawer';

@Component({
  tag: 'rula-drawer',
  styleUrl: 'drawer.scss',
  host: {
    theme: 'mdc-drawer mdc-drawer--temporary'
  }
})

export class RulaDrawer {
  private _drawer: MDCTemporaryDrawer;

  @Element() root: HTMLElement;

  @Prop() open: boolean;

  noFocusTrap: boolean = false;

  firstTabStop: HTMLElement;
  lastTabStop: HTMLElement;

  oldTabStop: HTMLElement;

  @Event() drawerClose: EventEmitter;

  render() {
    return (
      <nav class='mdc-drawer__drawer'>
        <slot />
      </nav>
    );
  }

  componentWillLoad() {
    
  }

  componentDidLoad() {
    this._drawer = new MDCTemporaryDrawer(this.root);
    this._drawer.listen('MDCTemporaryDrawer:close', () => {
      //this.root.removeAttribute('open');
      this.drawerClose.emit();
      this.oldTabStop.focus();
    });

    this._drawer.listen('MDCTemporaryDrawer:open', () => {
      this.setFocusTrap_();
    });

    let links = this.root.querySelectorAll(MDCTemporaryDrawerFoundation.strings.FOCUSABLE_ELEMENTS);
    Object.keys(links).map(key => {
      links[key].addEventListener('click', () => {
        this._drawer.open = false;
      });
    });
  }

  @Watch('open')
  openDrawer() {
    this._drawer.open = this.open;
  }

  @Listen('keydown.tab')
  handleTab(ev: KeyboardEvent) {
    var TAB_KEYCODE = 9;
    if (this._drawer.open && ev.keyCode === TAB_KEYCODE) {
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

  setFocusTrap_() {
    var focusableElements = this.root.querySelectorAll(MDCTemporaryDrawerFoundation.strings.FOCUSABLE_ELEMENTS);

    if (focusableElements.length > 0) {
      this.firstTabStop = focusableElements[0] as HTMLElement;
      this.lastTabStop = focusableElements[focusableElements.length - 1] as HTMLElement;
    } else {
      // Reset saved tab stops when there are no focusable elements in the card.
      this.firstTabStop = null;
      this.lastTabStop = null;
    }

    this.oldTabStop = document.activeElement as HTMLElement;
  }
}
