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
    loadData('faqs', FAQ_STORAGE_KEY).then((faqs: FaqMap) => {
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
        'rl-view': true,
        'rl-view--faq': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  /**
   * Component render function.
   */
  render() {
    if (this.faqs) {
      return ([
        <stencil-route-title title="FAQs" />,
        <h2 class="rl-view__heading">Frequently asked questions</h2>,
        <div id="container" class="rl-view-faq__container" role="list">
          <rl-accordion>
            {Object.values(this.faqs).map((faq, idx) =>
              <rl-accordion-item class="rl-accordion-item rl-accordion-item--fade-in"
                index={idx} delay={idx * 30}>
                <div slot="header">{faq.question}</div>
                <div slot="content">{sanitize(faq.answer)}</div>
              </rl-accordion-item>
            )}
          </rl-accordion>
        </div>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
