import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';

import { LOCAL_STORAGE_KEY } from '../../global/constants';
import { Faq, FaqMap } from '../../interface';
import { loadData } from '../../utils/load-data';
import { sanitize } from '../../utils/sanitize';

@Component({
  tag: 'view-faq',
  styleUrl: 'view-faq.scss',
})

export class ViewFaq {
  @Element() root!: HTMLElement;

  /**
   * Internal list of FAQs to display.
   */
  @State() faqs?: FaqMap;

  /**
   * A flag indicating if this view loaded all the data needed to display.
   */
  @State() loaded = false;

  @State() selectedFaq?: number;

  /**
   * Global flag indicating if the whole application has loaded.  If not, this
   * view should not display either.
   */
  @Prop() appLoaded = false;

  @Prop() match!: MatchResults;

  @Prop() history!: RouterHistory;

  /**
   * Lifecycle event fired when the component is first initialized and not
   * yet in the DOM.
   */
  componentWillLoad() {
    if (this.match && this.match.params) {
      if (this.match.params.faqId) {
        this.selectedFaq = Number(this.match.params.faqId);
      }
    }

    // Start loading the FAQs.
    loadData('faqs', LOCAL_STORAGE_KEY.FAQ).then((faqs: FaqMap) => {
      this.faqs = faqs;
      this.loaded = true;
    }, reason => {
      console.log(reason);
    });
  }

  @Listen('afterExpand')
  onAfterExpand() {
    const active = this.root.querySelector('.rl-accordion-item--open') as HTMLRlAccordionItemElement;
    this.selectedFaq = active ? active.index : undefined;
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
      // Update page URL.
      this.history.replace(`/faqs/${this.selectedFaq}`);

      return ([
        <stencil-route-title pageTitle="Frequently Asked Questions" />,
        <h1 class="rl-view__heading">Frequently asked questions</h1>,
        <div id="container" class="rl-view-faq__container">
          <rl-accordion>
            {Object.values(this.faqs).map((faq: Faq, idx) =>
              <rl-accordion-item
                class="rl-accordion-item rl-accordion-item--fade-in"
                index={faq.id}
                delay={idx * 30}
                isOpen={this.selectedFaq === faq.id}
              >
                <div slot="header">{faq.question}</div>
                <div slot="content">{sanitize(faq.answer || '')}</div>
              </rl-accordion-item>
            )}
          </rl-accordion>
        </div>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
