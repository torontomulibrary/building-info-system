import { Component, Element, Host, Prop, State, h } from '@stencil/core';
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
  @State() clusterColumns = 5;

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
      this.updateWidth();
    }
  }

  updateWidth() {
    const width = this.root.clientWidth - 128;
    this.clusterColumns = 700 > width ? 3 : 928 > width ? 4 : 1160 > width ? 5 : 1392 > width ? 6 : 1624 > width ? 7 : 8;
  }

  _cardClicked(e: CustomEvent) {
    e.preventDefault();

    const card: Card = e.detail;
    this.history.push(`${BASE_URL}${ROUTES.SEARCH}/${card.cardData}`);
  }

  render() {
    // Render resent searches and popular books.
    if (this.searches) {
      return (
        <Host style={{
          opacity: (this.loaded && this.appLoaded) ? '1' : '0',
        }} class={{
          'rl-view': true,
          'rl-view--book': true,
          'rl-view--transition': this.inDom,
        }}>
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
          </div>
          <rl-cluster
            heading="Recent Books"
            type="search"
            columns={this.clusterColumns}
            data={this.searches.recent}>
          </rl-cluster>
          <rl-cluster
            heading="Popular Books"
            type="search"
            columns={this.clusterColumns}
            data={this.searches.popular}>
          </rl-cluster>
        </Host>
      );
    }

    return (
      <Host style={{
        opacity: (this.loaded && this.appLoaded) ? '1' : '0',
      }} class={{
        'rl-view': true,
        'rl-view--book': true,
        'rl-view--transition': this.inDom,
      }}>
        <div>Loading...</div>
      </Host>
    );
  }
}
