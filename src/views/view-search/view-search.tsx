import { Component, Prop, State, Watch } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';

import { BASE_URL } from '../../global/constants';
// import { AppData } from '../../interface';
import { Color } from '../../utils/color';
import { fetchJSON } from '../../utils/fetch';

@Component({
  tag: 'view-search',
  styleUrl: 'view-search.scss',
})

export class ViewSearch {

  /**
   * The query currently being searched for.
   */
  @State() searchQuery?: string;
  @Watch('searchQuery')
  onSearchQueryChanged(newQuery: string) {
    if (newQuery && this.searchUrl) {
      const results = fetchJSON(this.searchUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        mode: 'cors',
        body: 's_q=' + newQuery,
      });
      results
        .then(res => this.searchResults = res)
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
      this.history.push('/', {});
    }
  }

  @Prop() searchUrl?: string;

  @Prop() appLoaded = false;

  // @Prop() appData!: AppData;

  /**
   * The component lifecycle function called when the component is being
   * loaded but before DOM is created and displayed.
   */
  componentWillLoad() {
    // Needed to call with the initial value.  The @Watch decorator is not
    // called when the component loads with the first value.
    this.onMatchChanged(this.match);
  }

  _bookCardClicked(e: CustomEvent) {
    e.preventDefault();

    const data = e.detail.cardData;
    if (typeof data === 'object') {
      const record = data.ExternalDocumentID[0].substring(0, 8);
      this.history.push(`${BASE_URL}/books/map/${record}`, { record });
    }
  }

  _renderBooks() {
    const books = this.searchResults && this.searchResults['books'];
    if (books) {
      return (
        <rula-collection collectionTitle="Books">
          {books.map(b =>
            <rula-card
              cardTitle={b.Title[0]}
              cardData={b}
              titleInMedia
              noContent
              hasPrimaryAction
              wideMediaAspect
              protectionColor={new Color(12, 34, 56)}
              onCardClicked={evt => this._bookCardClicked(evt)}>
            </rula-card>
          )}
         </rula-collection>
      );
    } else {
      return undefined;
    }
  }

  render() {
    return ([
      <stencil-route-title title="Search" />,
      <div>
        Welcome to the search results.
        {this._renderBooks()}
      </div>,
    ]);
  }
}
