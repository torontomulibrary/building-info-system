import { Component, Element, Listen, Prop, State, h } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { RouterHistory } from '@stencil/router';

import { APP_DATA } from '../../global/constants';
import { ComputerLab, SearchHistory } from '../../interface';
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
    // this.updateWidth();
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

  hostData() {
    return {
      class: {
        'rl-view': true,
        'rl-view--home': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    if (this.searches === undefined || this.labs === undefined) {
      return;
    }

    return ([
      <stencil-route-title pageTitle="Home" />,
      <rl-cluster
        heading="Recent Books"
        type="search"
        columns={this.clusterColumns}
        data={this.searches.recent}>
      </rl-cluster>,
      <rl-cluster
        heading="Popular Books"
        type="search"
        columns={this.clusterColumns}
        data={this.searches.popular}>
      </rl-cluster>,
      <rl-cluster
        heading="Computer Availability"
        type="computer"
        columns={this.clusterColumns}
        data={this.labs}>
      </rl-cluster>,
    ]);
  }
}
