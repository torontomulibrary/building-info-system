import { Component, Element, Prop, State } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { RouterHistory } from '@stencil/router';

import { Card } from '../../components/card/card';
import { BASE_URL } from '../../global/config';
import { APP_DATA, ROUTES } from '../../global/constants';
import { SearchHistory } from '../../interface';
import { dataService } from '../../utils/data-service';

@Component({
  tag: 'view-book',
  styleUrl: 'view-book.scss',
})

export class ViewBooks {
  @Element() root!: HTMLElement;

  @State() searches?: SearchHistory;

  @State() loaded = false;
  @State() inDom = false;

  // @Prop({ mutable: true }) appData!: AppData;

  @Prop() history!: RouterHistory;

  @Prop() appLoaded = false;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentWillLoad() {
    this.searches = dataService.getData(APP_DATA.HISTORY);
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

  _cardClicked(e: CustomEvent) {
    e.preventDefault();

    const card: Card = e.detail;
    this.history.push(`${BASE_URL}${ROUTES.SEARCH}/${card.cardData}`);
  }

  hostData() {
    return {
      class: {
        'rl-view': true,
        'rl-view--book': true,
        'rl-view--transition': this.inDom,
      },
      style: {
        opacity: (this.loaded && this.appLoaded) ? 1 : 0,
      },
    };
  }

  render() {
    // Render resent searches and popular books.
    if (this.searches) {
      return ([
        <stencil-route-title pageTitle="Books" />,
        <div class="mdc-layout-grid">
          <div class="mdc-layout-grid__inner">
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-2-desktop"></div>
            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop">
              Welcome to the Ryerson Library Book Finder.  Use it to find where the
              book you're looking for is in the Library.  Below are some common search
              terms and popular books.  To look for a specific book, use the search
              bar above.
              <slot />
            </div>
          </div>
        </div>,
        <rl-section-with-header>
          <h3 slot="title" role="heading" arial-level="2">Recent Searches</h3>
          <rl-scrolling-carousel>
            {this.searches.recent.map(s =>
              <rl-card
                cardData={s.value}
                hasPrimaryAction
                onCardClicked={ev => this._cardClicked(ev)}>
                <div slot="primary">
                  {s.value}
                </div>
              </rl-card>
            )}
          </rl-scrolling-carousel>
        </rl-section-with-header>,
        <rl-section-with-header>
          <h3 slot="title" role="heading" arial-level="2">Frequent Searches</h3>
          <rl-scrolling-carousel>
            {this.searches.popular.map(s =>
              <rl-card
                cardData={s.value}
                hasPrimaryAction
                onCardClicked={ev => this._cardClicked(ev.detail)}>
                <div slot="primary">
                  {s.value}
                </div>
              </rl-card>
            )}
          </rl-scrolling-carousel>
        </rl-section-with-header>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
