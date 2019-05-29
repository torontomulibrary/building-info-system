import { Component, Element, Listen, Method, Prop, State } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { MatchResults, RouterHistory } from '@stencil/router';

import { BASE_URL } from '../../global/config';
import { APP_DATA, ROUTES } from '../../global/constants';
import { Faq, FaqMap } from '../../interface';
import { dataService } from '../../utils/data-service';
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

  @Prop({ context: 'queue' }) queue!: QueueApi;

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
          pathname: `${BASE_URL}${ROUTES.FAQS}/${this.selectedFaq}`,
          state: { faqId: this.selectedFaq },
          query: {},
          key: '',
        });
      }
    }

    this.faqs = dataService.getData(APP_DATA.FAQS);
  }

  componentDidLoad() {
    this.checkSize();
  }

  checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this.checkSize();
      });
    } else {
      this.loaded = true;
    }
  }

  componentWillUpdate() {
    // Handle when the parameter may change based on user history navigation.
    const state = this.history.location.state;
    const path = `${BASE_URL}${ROUTES.FAQS}/`;

    if (this.selectedFaq !== undefined) {
      // A FAQ is active, ensure the current route state matches.
      if (state === undefined || state && state.faqId === undefined ||
          state && state.faqId && this.selectedFaq !== state.faqId) {
        // State needs to be updated/changed to match newly selected FAQ.
        this.history.push({
          pathname: `${path}${this.selectedFaq}`,
          state: { faqId: this.selectedFaq },
          query: {},
          key: '',
        });
      }
    } else {
      if (state !== undefined) {
        this.history.push({ pathname: path, state: undefined, query: {}, key: '' });
      }
    }
  }

  @Listen('afterExpand')
  onAfterExpand(evt: Event) {
    const t = evt.target as HTMLRlAccordionItemElement;
    if (t !== null) {
      this.selectedFaq = t.index;
      t.focusTitle();

      if (t.getBoundingClientRect().bottom > window.innerHeight) {
        t.scrollIntoView();
      }
    }
  }

  @Listen('afterCollapse')
  onAfterCollapse(evt: Event) {
    const t = evt.target as HTMLRlAccordionItemElement;
    if (t !== null && t.index === this.selectedFaq) {
      this.selectedFaq = undefined;
    }
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
      const title = (this.selectedFaq ? `${this.faqs[this.selectedFaq].question} | ` : '') + 'FAQs';

      return ([
        <stencil-route-title pageTitle={title} />,
        <h1 class="rl-view__heading">Frequently asked questions</h1>,
        <div id="container" class="rl-view-faq__container">
          <rl-accordion>
            {Object.values(this.faqs).map((faq: Faq, idx) =>
                <rl-accordion-item
                  class="rl-accordion-item rl-accordion-item--fade-in"
                  index={faq.id}
                  delay={idx * 15}
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
