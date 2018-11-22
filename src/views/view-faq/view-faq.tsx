import { Component, Prop, State } from '@stencil/core';

import { FAQ_STORAGE_KEY } from '../../global/constants';
import { FaqMap } from '../../interface';
import { loadData } from '../../utils/load-data';
import { sanitize } from '../../utils/sanitize';

@Component({
  tag: 'view-faq',
  styleUrl: 'view-faq.scss',
})

export class ViewFaq {
  /**
   * Internal list of FAQs to display.
   */
  @State() faqs?: FaqMap;

  /**
   * A flag indicating if this view loaded all the data needed to display.
   */
  @State() loaded = false;

  /**
   * Global flag indicating if the whole application has loaded.  If not, this
   * view should not display either.
   */
  @Prop() appLoaded = false;

  /**
   * Lifecycle event fired when the component is first initialized and not
   * yet in the DOM.
   */
  componentWillLoad() {
    // Start loading the FAQs.
    loadData<FaqMap>(FAQ_STORAGE_KEY, 'faqs').then((faqs: FaqMap) => {
      this.faqs = faqs;
      this.loaded = true;
    }, reason => {
      console.log(reason);
    });
  }

  /**
   * Dynamically sets host element attributes.
   */
  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--faq': true,
        'rula-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  /**
   * Render the component.
   */
  render() {
    if (this.faqs) {
      return ([
        <stencil-route-title title="FAQs" />,
        <h2 class="rula-view__heading">Frequently asked questions</h2>,
        <div id="container" class="rula-view-faq__container" role="list">
          <rula-accordion>
            {Object.values(this.faqs).map((faq, idx) =>
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

    return (<div>Loading...</div>);
  }
}
