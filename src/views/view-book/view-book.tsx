import { Component, Prop, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

import { Card } from '../../components/card/card';
import { BASE_URL, SEARCH_HISTORY_STORAGE_KEY } from '../../global/constants';
import { SearchHistory } from '../../interface';
// import { fetchJSON } from '../../utils/fetch';
import { loadData } from '../../utils/load-data';

@Component({
  tag: 'view-book',
  styleUrl: 'view-book.scss',
})

export class ViewBooks {
  @State() searches?: SearchHistory;

  @State() loaded = false;

  // @Prop({ mutable: true }) appData!: AppData;

  @Prop() history!: RouterHistory;

  @Prop() appLoaded = false;

  componentWillLoad() {
    // Load search history.
    loadData('history', SEARCH_HISTORY_STORAGE_KEY).then((history: SearchHistory) => {
      this.searches = history;
      this.loaded = true;
    }, reason => {
      console.log(reason);
    });
    // if (this.appData && this.appData.searches) {
    //   this.loaded = true;
    // } else {
    //   fetchJSON(API_URL + 'history').then((history: SearchHistory) => {
    //     this.appData = { ...this.appData, searches: {
    //       popular: history.popular,
    //       recent: history.recent,
    //     }};

    //     this.loaded = true;
    //   });
    // }
  }

  _cardClicked(e: CustomEvent) {
    e.preventDefault();

    const card: Card = e.detail;
    this.history.push(`${BASE_URL}sr/${card.cardData}`);
  }

  hostData() {
    return {
      class: {
        'rl-view': true,
        'rl-view--book': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    // Render resent searches and popular books.
    if (this.searches) {
      return ([
        <stencil-route-title pageTitle="Books" />,
        <div class="rl-block--centered">
          Welcome to the Ryerson Library Book Finder.  Use it to find where the
          book you're looking for is in the Library.  Below are some common search
          terms and popular books.  To look for a specific book, use the search
          bar above.
          <slot />
        </div>,
        <rl-collection collectionTitle="Recently Searched">
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
        </rl-collection>,
        <rl-collection collectionTitle="Frequently Searched">
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
        </rl-collection>,
        <rl-collection collectionTitle="Popular Books">
          <rl-card></rl-card>
          <rl-card></rl-card>
        </rl-collection>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
