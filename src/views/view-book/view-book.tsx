import { Component, Prop, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

import { Card } from '../../components/card/card';
import { API_URL, BASE_URL } from '../../global/constants';
import { AppData, SearchHistory } from '../../interface';
import { fetchJSON } from '../../utils/fetch';

@Component({
  tag: 'view-book',
  styleUrl: 'view-book.scss',
})

export class ViewBooks {
  @State() loaded = false;

  @Prop({ mutable: true }) appData!: AppData;

  @Prop() history!: RouterHistory;

  @Prop() appLoaded = false;

  componentWillLoad() {
    // Load search history.
    if (this.appData && this.appData.searches) {
      this.loaded = true;
    } else {
      fetchJSON(API_URL + 'history').then((history: SearchHistory) => {
        this.appData = { ...this.appData, searches: {
          popular: history.popular,
          recent: history.recent,
        }};

        this.loaded = true;
      });
    }
  }

  _cardClicked(e: CustomEvent) {
    e.preventDefault();

    const card: Card = e.detail;
    this.history.push(`${BASE_URL}sr/${card.cardData}`);
  }

  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--book': true,
        'rula-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    // Render resent searches and popular books.
    if (this.appData && this.appData.searches) {
      return ([
        <stencil-route-title pageTitle="Books" />,
        <div class="rula-block--centered">
          Welcome to the Ryerson Library Book Finder.  Use it to find where the
          book you're looking for is in the Library.  Below are some common search
          terms and popular books.  To look for a specific book, use the search
          bar above.
          <slot />
        </div>,
        <rula-collection collectionTitle="Recently Searched">
          {this.appData.searches.recent.map(s =>
            <rula-card
              cardData={s.value}
              hasPrimaryAction
              onCardClicked={ev => this._cardClicked(ev)}>
              <div slot="primary">
                {s.value}
              </div>
            </rula-card>
          )}
        </rula-collection>,
        <rula-collection collectionTitle="Frequently Searched">
          {this.appData.searches.popular.map(s =>
            <rula-card
              cardData={s.value}
              hasPrimaryAction
              onCardClicked={ev => this._cardClicked(ev.detail)}>
              <div slot="primary">
                {s.value}
              </div>
            </rula-card>
          )}
        </rula-collection>,
        <rula-collection collectionTitle="Popular Books">
          <rula-card></rula-card>
          <rula-card></rula-card>
        </rula-collection>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
