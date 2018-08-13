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
  private _storeUnsubscribe: Function;

  private _firstTabStop: HTMLElement;
  private _lastTabStop: HTMLElement;

  private _oldTabStop: HTMLElement;

  @Element() root: HTMLStencilElement;

  @State() _animated = false;
  @State() _details: MapElementDetail[] = [];
  @Prop({ mutable: true }) open: boolean;

  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  async componentWillLoad() {
    this.lazyStore.addReducers({map});
    this._storeUnsubscribe = this.lazyStore.subscribe(() =>
      this._stateChanged(this.lazyStore.getState().map)
    );
  }

  componentDidUnload() {
    this._storeUnsubscribe();
  }

  @Listen('keydown.tab')
  handleTab(evt: KeyboardEvent) {
    var TAB_KEYCODE = 9;

    if (this.open && evt.keyCode === TAB_KEYCODE) {
      if (evt.shiftKey) {
        if (this._firstTabStop && evt.target === this._firstTabStop) {
          evt.preventDefault();
          this._lastTabStop.focus();
        }
      } else {
        if (this._lastTabStop && evt.target === this._lastTabStop) {
          evt.preventDefault();
          this._firstTabStop.focus();
        }
      }
    }
  }

  _setFocusTrap() {
    var focusableElements = this.root.querySelectorAll(FOCUSABLE_ELEMENTS);

    if (focusableElements.length > 0) {
      this._firstTabStop = focusableElements[0] as HTMLElement;
      this._lastTabStop = focusableElements[focusableElements.length - 1] as HTMLElement;
    } else {
      // Reset saved tab stops when there are no focusable elements in the card.
      this._firstTabStop = null;
      this._lastTabStop = null;
    }

    this._oldTabStop = document.activeElement as HTMLElement;
  }

  _stateChanged(state) {
    if (state.activeElement && state.activeElement.details) {
      this._details = Object.values(state.activeElement.details);
      this.root.addEventListener('transitionend', this._handleTransitionEnd);
      this._animated = true;
      this.open = true;
      this._setFocusTrap();

      this._firstTabStop.focus();
    } else {
      this.root.addEventListener('transitionend', this._handleTransitionEnd);
      this._animated = true;
      this.open = false;

      if (this._oldTabStop) {
        this._oldTabStop.focus();
      }
    }
  }

  _handleTransitionEnd(evt) {
    if (this.root === evt.target) {
      this._animated = false;
      this.root.removeEventListener('transitionend', this._handleTransitionEnd);
    }
  }

  hostData() {
    return {
      class: {
        'rula-detail-panel--open': this.open,
        'rula-detail-panel--animated': this._animated
      }
    }
  }

  render() {
    let detail = this._details[0];
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