import { Component, Element, Listen, Method, Prop, State } from '@stencil/core';
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

  /**
   * The ID of the currently active (open) FAQ.
   */
  @State() selectedFaq?: number;

  /**
   * Global flag indicating if the whole application has loaded.  If not, this
   * view should not display either.
   */
  @Prop() appLoaded = false;

  /**
   * Reference to the object passed in from Stencil containing any URL path
   * variables that were matched by the router.
   */
  @Prop() match!: MatchResults;

  /**
   * Reference to the stencil-router history object. Used to programmatically
   * change the browser history when the selected FAQ changes.
   */
  @Prop() history!: RouterHistory;

  /**
   * Lifecycle event fired when the component is first initialized and not
   * yet in the DOM.
   */
  componentWillLoad() {
    if (this.match && this.match.params) {
      if (this.match.params.faqId) {
        this.selectedFaq = Number(this.match.params.faqId);
        // Set the internal state of the current history item.
        this.history.replace({
          pathname: `/faqs/${this.selectedFaq}`,
          state: { faqId: this.selectedFaq },
          query: {},
          key: '',
        });
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

  componentWillUpdate() {
    // Handle when the parameter may change based on user history navigation.
    const state = this.history.location.state;
    if (state && state.faqId && this.selectedFaq !== state.faqId) {
      // State needs to be updated/changed to match newly selected FAQ.
      console.log(`Pushing history -- state: ${state.faqId} vs. sel: ${this.selectedFaq}`);
      if (this.selectedFaq) {
          this.history.push({
            pathname: `/faqs/${this.selectedFaq}`,
            state: { faqId: this.selectedFaq },
            query: {},
            key: '',
          });
        }
    }
  }

  @Listen('afterExpand')
  onAfterExpand() {
    const active = this.root.querySelector('.rl-accordion-item--open') as HTMLRlAccordionItemElement;
    this.selectedFaq = active ? active.index : undefined;
  }

  @Method()
  setActiveFaq(faqId: number) {
    // Set the newly selected FAQ.  State will handle all the updates.
    this.selectedFaq = faqId;
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
      // if (this.selectedFaq) {
      //   this.history.push({
      //     pathname: `/faqs/${this.selectedFaq}`,
      //     state: { faqId: this.selectedFaq },
      //     query: {},
      //     key: '',
      //   });
      // }

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
