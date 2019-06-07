import { Component, Element, Method, Prop, State, h } from '@stencil/core';
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
  /**
   * Reference to the root element.
   */
  @Element() root!: HTMLViewFaqElement;

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
    this.faqs = dataService.getData(APP_DATA.FAQS);
  }

  /**
   * Lifecycle event fired when the component has finished loading and is
   * rendered into the DOM.
   */
  componentDidLoad() {
    this._checkSize();
  }

  /**
   * Lifecycle event fired when part of the component (or child components)
   * has updated but before rendering has taken place.
   */
  componentWillUpdate() {
    this._loadAndVerifySelectedFaq();
  }

  /**
   * Check the current URL parameters to see if a selected FAQ has been given
   * as well as validate what is given.  In the case of an invalid option,
   * remove the option all together and leave no FAQ selected.
   */
  private _loadAndVerifySelectedFaq() {
    if (this.match && this.match.params && this.match.params.faqId) {
      const newFaq = Number(this.match.params.faqId);

      if (newFaq !== this.selectedFaq) {
        this.selectedFaq = newFaq;
      }

      if (this.selectedFaq !== undefined && (isNaN(this.selectedFaq) || this.selectedFaq <= 0 ||
      (this.faqs && Object.keys(this.faqs).indexOf(`${this.selectedFaq}`) === -1))) {
        this.selectedFaq = undefined;
        this.history.replace(`${BASE_URL}${ROUTES.FAQS}`);
      }
    }
  }

  /**
   * Check the rendered height of this component.  When it actually has a height
   * it is in the DOM AND has a display other than `none`.  Only then is the
   * view loaded and can be faded in.
   */
  private _checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this._checkSize();
      });
    } else {
      this.loaded = true;
    }
  }

  @Method()
  /**
   * Change the FAQ that is currently active
   * @deprecated Specify the selected FAQ by changing the URL.
   */
  async setActiveFaq(faqId: number) {
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
