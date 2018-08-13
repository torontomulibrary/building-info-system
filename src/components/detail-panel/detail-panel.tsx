import { Component, Element, Prop, State, Listen } from '@stencil/core';
import {
  LazyStore,
  MapElementDetail,
} from '../../interface';

import { FOCUSABLE_ELEMENTS } from '../../global/constants';

import map from '../../reducers/map-reducer';

import {
  updateActiveElement,
} from '../../actions/map-actions';

@Component({
  tag: 'rula-detail-panel',
  styleUrl: 'detail-panel.scss',
  host: {
    theme: 'rula-detail-panel'
  }
})

export class DetailPanel {
  /**
   * The first tabbable child element of this detail panel.
   */
  private firstTabStop: HTMLElement;

  /**
   * The last tabbable child element of this detail panel.
   */
  private lastTabStop: HTMLElement;

  /**
   * The element that has focus when this detail panel is opened.
   */
  private oldTabStop: HTMLElement;
  
  /**
   * Callback function used to unsubscribe from the Redux store.
   */
  private storeUnsubscribe: Function;

  /**
   * Root element of this component.
   */
  @Element() root: HTMLStencilElement;

  /**
   * Flag indicating if an animation is taking place.
   */
  @State() animated = false;

  /**
   * The list of ElementDetails to be displayed.
   */
  @State() details: MapElementDetail[] = [];

  /**
   * The global Redux store.
   */
  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  /**
   * A flag indicating if this detail panel is open.
   */
  @Prop({ mutable: true }) open: boolean;

  async componentWillLoad() {
    this.lazyStore.addReducers({map});
    this.storeUnsubscribe = this.lazyStore.subscribe(() =>
      this.stateChanged(this.lazyStore.getState().map)
    );
  }

  componentDidUnload() {
    this.storeUnsubscribe();
  }

  @Listen('keydown.tab')
  handleTab(evt: KeyboardEvent) {
    var TAB_KEYCODE = 9;

    if (this.open && evt.keyCode === TAB_KEYCODE) {
      if (evt.shiftKey) {
        if (this.firstTabStop && evt.target === this.firstTabStop) {
          evt.preventDefault();
          this.lastTabStop.focus();
        }
      } else {
        if (this.lastTabStop && evt.target === this.lastTabStop) {
          evt.preventDefault();
          this.firstTabStop.focus();
        }
      }
    }
  }

  setFocusTrap() {
    var focusableElements = this.root.querySelectorAll(FOCUSABLE_ELEMENTS);

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

  stateChanged(state) {
    if (state.activeElement && state.activeElement.details) {
      this.details = Object.values(state.activeElement.details);
      this.root.addEventListener('transitionend', this.handleTransitionEnd);
      this.animated = true;
      this.open = true;
      this.setFocusTrap();

      this.firstTabStop.focus();
    } else {
      this.root.addEventListener('transitionend', this.handleTransitionEnd);
      this.animated = true;
      this.open = false;

      if (this.oldTabStop) {
        this.oldTabStop.focus();
      }
    }
  }

  handleTransitionEnd(evt) {
    if (this.root === evt.target) {
      this.animated = false;
      this.root.removeEventListener('transitionend', this.handleTransitionEnd);
    }
  }

  hostData() {
    return {
      class: {
        'rula-detail-panel--open': this.open,
        'rula-detail-panel--animated': this.animated
      }
    }
  }

  render() {
    let detail = this.details[0];
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
              onClick={_ => {this.lazyStore.dispatch(updateActiveElement(undefined));}}
              aria-label="Close detail panel.">
            close
          </button>
        </header>,
        <div class="rula-detail-panel__content">
          <div class="rula-detail-panel__section">
            <div class="rula-detail-panel__subtitle mdc-typography--subtitle2">Description</div>
            {detail && detail.description || ''}
          </div>
          {/* <div class="rula-detail-panel__section">
            <button
                class="mdc-button rula-detail-panel__action"
                aria-label={`Get directions to ${detail.code}`}>
                <i class="material-icons mdc-button__icon" aria-hidden="true">
                  directions
                </i>
              Directions
            </button>
          </div> */}
        </div>
    ]);
  }
}