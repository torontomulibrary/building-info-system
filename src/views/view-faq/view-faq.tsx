import { Component, Prop, State } from '@stencil/core';

import {
  getFaqData,
} from '../../actions/faq-actions';
import { APP_TITLE } from '../../global/constants';
import {
  Faq,
  FaqMap,
  LazyStore,
} from '../../interface';
import { faqReducer } from '../../reducers/faq-reducer';
import { sanitize } from '../../utils/sanitize';

@Component({
  tag: 'view-faq',
  styleUrl: 'view-faq.scss',
  host: {
    theme: 'rula-view rula-view--faq',
  },
})

export class ViewFaq {
  /**
   * Callback function used to unsubscribe from the Redux store.
   */
  private storeUnsubscribe: Function;

  /**
   * The currently active FAQ.
   */
  @State() activeFaq: Faq;

  /**
   * A list of all the FAQs that will be displayed.
   */
  @State() allFaqs: FaqMap;

  /**
   * The global Redux store.
   */
  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  /**
   * A URL used to access when loading data.
   */
  @Prop() apiUrl: string;

  async componentWillLoad() {
    this.lazyStore.addReducers({ faqReducer });
    this.storeUnsubscribe = this.lazyStore.subscribe(() =>
      this._stateChanged(this.lazyStore.getState().faq)
    );

    if (this.apiUrl) {
      this.lazyStore.dispatch(getFaqData(this.apiUrl));
    } else {
      // Fail preloading with 'Unable to load map data!'
    }

    document.title = `FAQs | ${APP_TITLE}`;
  }

  componentDidUnload() {
    this.storeUnsubscribe();
    document.title = APP_TITLE;
  }

  _stateChanged(state) {
    this.allFaqs = this._renameKeys(state.allFaqs, { 'questiion': 'header', 'answer': 'content' });
    this.activeFaq = state.activeFaq;
  }

  _renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  render() {
    if (!this.allFaqs) return;

    return ([
      <h2 class="rula-view__heading">Frequently asked questions</h2>,
      <div id="container" class="rula-view-faq__container" role="list">
        <rula-accordion>
          {Object.values(this.allFaqs).map((faq, idx) =>
            <rula-accordion-item class="rula-accordion-item rula-accordion-item--fade-in"
              index={idx} delay={idx * 30}>
              <div slot="header">{faq.question}</div>
              <div slot="content">{sanitize(faq.answer)}</div>
            </rula-accordion-item>
          )}
        </rula-accordion>
      </div>,
    ]);
  }
}
