import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { RouterHistory } from '@stencil/router';

// import * as d from '../../declarations';
import { BASE_URL } from '../../global/config';
import { MAP_TYPE, ROUTES } from '../../global/constants';
import { ClusterData, ComputerLab, SearchHistory } from '../../interface';
import { dataStore } from '../../utils/app-data';
// import { dataService } from '../../utils/data-service';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.scss',
})

export class ViewHome {
  @Element() root!: HTMLViewHomeElement;

  @State() loaded = false;
  @State() searches?: SearchHistory;
  @State() labs?: ComputerLab[] = [];

  @Prop() appLoaded = false;
  @Prop() clusterColumns = 2;
  @Prop() isMobile = false;

  /**
   * Reference to the stencil-router history object. Used to programmatically
   * change the browser history when the selected FAQ changes.
   */
  @Prop() history!: RouterHistory;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentWillLoad() {
    dataStore.getData('computers').then(comps => {
      this.labs = comps;
    }).catch(e => console.error('Error loading computer in view-home ' + e));

    dataStore.getData('history').then(history => {
      this.searches = history;
    }).catch(e => console.error('Error loading search in view-home ' + e));
    // this.searches = dataService.getData(APP_DATA.HISTORY);
    // this.labs = dataService.getData(APP_DATA.COMPUTERS);
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

  render() {
    if (this.searches === undefined || this.labs === undefined) {
      return;
    }

    // Convert search history into standardized CardData for displaying.
    const recent: ClusterData[] = this.searches.recent.map(r => {
      return { type: 'card', title: r.value, link: `${BASE_URL}${ROUTES.SEARCH}/${r.value}`, media: r.image, subTitle: '' } as ClusterData;
    });

    const popular: ClusterData[] = this.searches.popular.map(r => {
      return { type: 'card', title: r.value, link: `${BASE_URL}${ROUTES.SEARCH}/${r.value}`, media: r.image, subTitle: '' } as ClusterData;
    });

    const labs: ClusterData[] = this.labs.map(l => {
      return {
        type: 'list',
        title: l.code,
        subTitle: `${l.computerAvailable} of ${l.computerTotal} computer available`,
        link: `${BASE_URL}${ROUTES.MAP}/${MAP_TYPE.COMP}/${l.code}`,
      } as ClusterData;
    });

    return (
      <Host class={{
        'rl-view': true,
        'rl-view--home': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      }}>
        <stencil-route-title pageTitle="Home | " />
        <rl-cluster
          heading="Recent Book Searches"
          columns={this.clusterColumns}
          data={recent}
          isMobile={this.isMobile}
          parentEl={this.root}>
        </rl-cluster>
        <rl-cluster
          heading="Popular Book Searches"
          columns={this.clusterColumns}
          data={popular}
          isMobile={this.isMobile}
          parentEl={this.root}>
        </rl-cluster>
        <rl-cluster
          heading="Computer Availability"
          columns={this.clusterColumns}
          data={labs}
          isMobile={this.isMobile}
          parentEl={this.root}>
        </rl-cluster>
      </Host>
    );
  }
}
