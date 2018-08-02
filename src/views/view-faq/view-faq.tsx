import { Component, Prop, State } from '@stencil/core';
// import { sanitize } from '../../utils/sanitize';

import {
  LazyStore,
  Faq,
  FaqMap,
} from '../../interface';

import faq from '../../reducers/faq-reducer';
import {
  getFaqData,
} from '../../actions/faq-actions';

@Component({
  tag: 'view-faq',
  styleUrl: 'view-faq.scss',
  host: {
    theme: 'rula-view-faq'
  }
})

export class ViewFaq {
  private _storeUnsubscribe: Function;

  @State() _activeFaq: Faq;
  @State() _allFaqs: FaqMap;

  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;
  @Prop() apiUrl: string;

  async componentWillLoad() {
    this.lazyStore.addReducers({faq});
    this._storeUnsubscribe = this.lazyStore.subscribe(() =>
      this._stateChanged(this.lazyStore.getState().faq)
    );
    
    if (this.apiUrl) {
      this.lazyStore.dispatch(getFaqData(this.apiUrl));
    } else {
      // Fail preloading with 'Unable to load map data!'
    }

    document.title = 'FAQs - RULA Finder';
  }

  componentDidUnload() {
    this._storeUnsubscribe();
    document.title = 'RULA Finder'
  }

  _stateChanged(state) {
    this._allFaqs = this._renameKeys(state.allFaqs, {"questiion": "header", "answer": "content"});
    this._activeFaq = state.activeFaq;
  }

  _renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  render() {
    if (!this._allFaqs) return;

    return (
      <div id="container" class="rula-view-faq__container" role="list">
        <h2 class="mdc-typography--headline2">Frequently asked questions</h2>
        <ul class="mdc-list mdc-list--two-line" aria-orientation="vertical">
        {Object.values(this._allFaqs).map((faq) =>
          <li class="mdc-list-item" tabindex="0">
            <span class="mdc-list-item__graphic material-icons" aria-hidden="true">keyboard_arrow_down</span>
            {faq.question}
          </li>
        )}
        </ul>
      </div>
    );
  }
}
