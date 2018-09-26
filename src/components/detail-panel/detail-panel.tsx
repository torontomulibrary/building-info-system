import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { FOCUSABLE_ELEMENTS } from '../../global/constants';
import { MapElement, MapElementDetail } from '../../interface';

@Component({
  tag: 'rula-detail-panel',
  styleUrl: 'detail-panel.scss',
  host: {
    theme: 'rula-detail-panel',
  },
})

export class DetailPanel {
  /**
   * The first tabbable child element of this detail panel.
   */
  private firstTabStop?: HTMLElement;

  /**
   * The last tabbable child element of this detail panel.
   */
  private lastTabStop?: HTMLElement;

  /**
   * The element that has focus when this detail panel is opened.
   */
  private oldTabStop?: HTMLElement;

  /**
   * Callback function used to unsubscribe from the Redux store.
   */
  // private storeUnsubscribe!: Function;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

  /**
   * Flag indicating if an animation is taking place.
   */
  @State() isAnimating = false;

  /**
   * The list of ElementDetails to be displayed.
   */
  // @State() details: MapElementDetail[] = [];

  /**
   * The list of ElementDetails to be displayed.
   */
  @State() details: MapElementDetail[] = [];
  @Watch('details')
  onDetailsChanged() {
    this.root.addEventListener('transitionend', this.handleTransitionEnd);
    this.isAnimating = true;
    this.isOpen = true;
    this.setFocusTrap();

    if (this.firstTabStop) {
      this.firstTabStop.focus();
    }
  }

  @Prop() activeElement?: MapElement;
  @Watch('activeElement')
  onActiveElementChanged() {
    if (this.activeElement && this.activeElement.details) {
      this.details = [ ...Object.values(this.activeElement.details) ];
      this.root.addEventListener('transitionend', this.handleTransitionEnd);
      this.isAnimating = true;
      this.isOpen = true;
      this.setFocusTrap();

      if (this.firstTabStop) {
        this.firstTabStop.focus();
      }
    } else {
      this.root.addEventListener('transitionend', this.handleTransitionEnd);
      this.isAnimating = true;
      this.isOpen = false;

      if (this.oldTabStop) {
        this.oldTabStop.focus();
      }
    }
  }

  /**
   * The global Redux store.
   */
  // @Prop({ context: 'store' }) store!: Store;

  /**
   * A flag indicating if this detail panel is open.
   */
  @State() isOpen!: boolean;

  @Event() detailPanelClose!: EventEmitter;

  async componentWillLoad() {
    // this.lazyStore.addReducers({ mapReducer });
    // this.storeUnsubscribe = this.lazyStore.subscribe(() =>
    //   this.stateChanged(this.lazyStore.getState().mapReducer)
    // );
  }

  // componentDidUnload() {
    // this.storeUnsubscribe();
  // }

  @Listen('keydown.tab')
  handleTab(evt: KeyboardEvent) {
    const TAB_KEYCODE = '9';

    if (this.isOpen && evt.key === TAB_KEYCODE) {
      if (evt.shiftKey) {
        if (this.firstTabStop && evt.target === this.firstTabStop) {
          evt.preventDefault();
          if (this.lastTabStop) {
            this.lastTabStop.focus();
          }
        }
      } else {
        if (this.lastTabStop && evt.target === this.lastTabStop) {
          evt.preventDefault();
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

  /**
   * Show the DetailPanel.
   */
  @Method()
  showPanel() {
    this.root.addEventListener('transitionend', this.handleTransitionEnd);
    this.isAnimating = true;
    this.isOpen = true;
    this.setFocusTrap();

    if (this.firstTabStop) {
      this.firstTabStop.focus();
    }
  }

  /**
   * Hide the DetailPanel.
   */
  @Method()
  hidePanel() {
    this.root.addEventListener('transitionend', this.handleTransitionEnd);
    this.isAnimating = true;
    this.isOpen = false;

    if (this.oldTabStop) {
      this.oldTabStop.focus();
    }
  }

  // stateChanged(state: any) {
  //   if (state.activeElement && state.activeElement.details) {
  //     this.details = Object.values(state.activeElement.details);
  //     this.root.addEventListener('transitionend', this.handleTransitionEnd);
  //     this.isAnimating = true;
  //     this.open = true;
  //     this.setFocusTrap();

  //     if (this.firstTabStop) {
  //       this.firstTabStop.focus();
  //     }
  //   } else {
  //     this.root.addEventListener('transitionend', this.handleTransitionEnd);
  //     this.isAnimating = true;
  //     this.open = false;

  //     if (this.oldTabStop) {
  //       this.oldTabStop.focus();
  //     }
  //   }
  // }

  handleTransitionEnd(evt: any) {
    if (this.root === evt.target) {
      this.isAnimating = false;
      this.root.removeEventListener('transitionend', this.handleTransitionEnd);
    }
  }

  hostData() {
    return {
      class: {
        'rula-detail-panel--open': this.isOpen,
        'rula-detail-panel--animated': this.isAnimating,
      },
    };
  }

  render() {
    const detail = this.details[0];
    // For now assume that a MapElement has only one detail.  While it is
    // possible for an element to have more than one detail, for now it's not
    // supported from the front-end display.

    return ([
        <header class="rula-detail-panel__header">
          <span class="rula-detail-panel__title">
            <div class="mdc-typography--body2">{detail && detail.code || ''}</div>
            <div class="mdc-typography--headline6">{detail && detail.name || ''}</div>
          </span>
          <button
              class="material-icons rula-detail-panel__close"
              onClick={_ => { this.isOpen = false; this.detailPanelClose.emit(); }}
              aria-label="Close detail panel.">
            close
          </button>
        </header>,
        <div class="rula-detail-panel__content">
          <div class="rula-detail-panel__section">
            <div class="rula-detail-panel__subtitle mdc-typography--subtitle2">Description</div>
            {detail && detail.description || ''}
          </div>
        </div>,
    ]);
  }
}
