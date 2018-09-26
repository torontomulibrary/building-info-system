import { Component, Prop } from '@stencil/core';

import { FaqMap } from '../../interface';
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
   * A list of all the FAQs that will be displayed.
   */
  @Prop() allFaqs: FaqMap = {};

  _renameKeys(obj: any, newKeys: any) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  render() {
    return ([
      <stencil-route-title title="FAQs" />,
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
