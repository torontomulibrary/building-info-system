import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { RouterHistory } from '@stencil/router';

import { BASE_URL } from '../../global/config';
import { APP_DATA, CLUSTER_TYPE, ROUTES } from '../../global/constants';
import { CardData, ComputerLab, SearchHistory } from '../../interface';
import { dataService } from '../../utils/data-service';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.scss',
})

export class ViewHome {
  @Element() root!: HTMLElement;

  @State() loaded = false;
  @State() searches?: SearchHistory;
  @State() labs?: ComputerLab[] = [];
  @State() clusterColumns = 5;

  @Prop() appLoaded = false;

  /**
   * Reference to the stencil-router history object. Used to programmatically
   * change the browser history when the selected FAQ changes.
   */
  @Prop() history!: RouterHistory;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentWillLoad() {
    this.searches = dataService.getData(APP_DATA.HISTORY);
    this.labs = dataService.getData(APP_DATA.COMPUTERS);
  }

  componentDidLoad() {
    this.checkSize();
  }

  updateWidth() {
    const width = this.root.clientWidth - 128;
    this.clusterColumns = 700 > width ? 3 : 928 > width ? 4 : 1160 > width ? 5 : 1392 > width ? 6 : 1624 > width ? 7 : 8;
  }

  @Listen('resize', { target: 'window' })
  onresize() {
    this.updateWidth();
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

  render() {
    if (this.searches === undefined || this.labs === undefined) {
      return;
    }

    // Convert search history into standardized CardData for displaying.
    const recent: CardData[] = this.searches.recent.map(r => {
      return { title: r.value, link: `${BASE_URL}${ROUTES.SEARCH}/${r.value}`, media: r.image, subTitle: '' };
    });

    const popular: CardData[] = this.searches.popular.map(r => {
      return { title: r.value, link: `${BASE_URL}${ROUTES.SEARCH}/${r.value}`, media: r.image, subTitle: '' };
    });

    return (
      <Host class={{
        'rl-view': true,
        'rl-view--home': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      }}>
        <stencil-route-title pageTitle="Home" />
        <rl-cluster
          heading="Recent Books"
          type={CLUSTER_TYPE.CARD}
          columns={this.clusterColumns}
          data={recent}>
        </rl-cluster>
        <rl-cluster
          heading="Popular Books"
          type={CLUSTER_TYPE.CARD}
          columns={this.clusterColumns}
          data={popular}>
        </rl-cluster>
        <rl-cluster
          heading="Computer Availability"
          type={CLUSTER_TYPE.LIST}
          columns={this.clusterColumns}
          data={this.labs}>
        </rl-cluster>
      </Host>
    );
  }
}
