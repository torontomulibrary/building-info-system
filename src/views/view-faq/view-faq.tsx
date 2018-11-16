import { Component, Prop, State } from '@stencil/core';

import { AppData, FaqMap } from '../../interface';
import { fetchJSON } from '../../utils/fetch';
import { sanitize } from '../../utils/sanitize';

@Component({
  tag: 'view-faq',
  styleUrl: 'view-faq.scss',
})

export class ViewFaq {
  @State() loaded = false;

  /**
   * The global application data object.  Passed in by the main app and has
   * relevant data added to it by this view.
   */
  @Prop({ mutable: true }) appData!: AppData;

  componentWillLoad() {
    // Load FAQs.
    if (this.appData && this.appData.faqs) {
      this.loaded = true;
    } else {
      fetchJSON(this.appData.apiUrl + 'faqs').then((faqs: FaqMap) => {
        this.appData = { ...this.appData, faqs };
        this.loaded = true;
      });
    }
  }

  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--faq': true,
        'rula-view--loaded': this.loaded,
      },
    };
  }

  render() {
    if (this.appData && this.appData.faqs) {
      return ([
        <stencil-route-title title="FAQs" />,
        <h2 class="rula-view__heading">Frequently asked questions</h2>,
        <div id="container" class="rula-view-faq__container" role="list">
          <rula-accordion>
            {Object.values(this.appData.faqs).map((faq, idx) =>
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
