import { Component, Element, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { MatchResults, RouterHistory } from '@stencil/router';

import * as d from '../../declarations';
import { BASE_URL, SEARCH_URL } from '../../global/config';
import { CLUSTER_TYPE, MAP_TYPE, ROUTES } from '../../global/constants';
import { BookDetails } from '../../interface';
import { fetchJSON } from '../../utils/fetch';

@Component({
  tag: 'view-search',
  styleUrl: 'view-search.scss',
})

export class ViewSearch {
  @Element() root!: HTMLViewSearchElement;

  @State() loaded = false;
  @State() clusterColumns = 5;

  /**
   * The query currently being searched for.
   */
  @State() searchQuery?: string;
  @Watch('searchQuery')
  onSearchQueryChanged(newQuery: string) {
    if (newQuery && SEARCH_URL) {
      const results = fetchJSON(SEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        mode: 'cors',
        body: 's_q=' + newQuery,
      });
      results
        .then(res => {
          this.searchResults = res;
          this.loaded = true;
        })
        .catch(e => console.error(e.message));
    }
  }

  @State() searchResults?: object;

  @Prop() history!: RouterHistory;

  @Prop() match!: MatchResults;
  @Watch('match')
  onMatchChanged(newMatch: MatchResults) {
    if (newMatch && newMatch.params && newMatch.params.query) {
      this.searchQuery = newMatch.params.query;
    } else {
      // If no search query is provided, redirect to the home page.  There is
      // no point displaying a search page for an empty search!
      this.history.push(BASE_URL, {});
    }
  }

  @Prop({ context: 'queue' }) queue!: QueueApi;

  @Listen('resize', { target: 'window' })
  onresize() {
    const width = this.root.clientWidth - 128;
    this.clusterColumns = 700 > width ? 3 : 928 > width ? 4 : 1160 > width ? 5 : 1392 > width ? 6 : 1624 > width ? 7 : 8;
  }

  @Prop() searchUrl?: string;

  @Prop() appLoaded = false;

  /**
   * The component lifecycle function called when the component is being
   * loaded but before DOM is created and displayed.
   */
  componentWillLoad() {
    // Needed to call with the initial value.  The @Watch decorator is not
    // called when the component loads with the first value.
    this.onMatchChanged(this.match);
  }

  componentDidLoad() {
    this.checkSize();
  }

  updateWidth() {
    const width = this.root.clientWidth - 128;
    this.clusterColumns = 700 > width ? 3 : 928 > width ? 4 : 1160 > width ? 5 : 1392 > width ? 6 : 1624 > width ? 7 : 8;
  }

  checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this.checkSize();
      });
    } else {
      this.loaded = true;
      this.updateWidth();
    }
  }

  _bookCardClicked(e: CustomEvent) {
    e.preventDefault();

    const data = e.detail.cardData;
    if (typeof data === 'object') {
      const record = data.ExternalDocumentID[0].substring(0, 8);
      this.history.push(`${BASE_URL}${ROUTES.BOOKS}/map/${record}`, { record });
    }
  }

  _renderBooks() {
    if (this.searchResults) {
      const books: d.CardData = this.searchResults['books'].map((b: BookDetails) => {
        if (b.iSBN) {
          const av = b.availability ? b.availability[0] : undefined;
          return {
            title: b.title,
            subTitle: av ? av.statusMessage : 'Unknown Availability',
            link: av ? `${BASE_URL}${ROUTES.MAP}/${MAP_TYPE.BOOK}/${av.shelf}/${b.iSBN[0]}` : '',
            media: b.thumbnail_m ? b.thumbnail_m : undefined,
          };
        }

        return undefined;
      }).filter((b: d.CardData) => b !== undefined);

      return (
        <rl-cluster
          heading="Books"
          type={CLUSTER_TYPE.CARD}
          columns={this.clusterColumns}
          data={books}>
        </rl-cluster>
      );
    } else {
      return undefined;
    }
  }

  render() {
    return (
      <Host class={{
        'rl-view': true,
        'rl-view--search': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      }}>
        <stencil-route-title pageTitle="Search Results | " />
        <div>
          {this._renderBooks()}
        </div>
      </Host>
    );
  }
}
