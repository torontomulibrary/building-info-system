import { Component, Element, Prop, State } from '@stencil/core';
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

  checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this.checkSize();
      });
    } else {
      this.loaded = true;
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

    // const compAvail = this.labs.reduce((val, lab) => val += lab.compAvail, 0);
    // const compTotal = this.labs.reduce((val, lab) => val += lab.compTotal, 0);

    return ([
      <stencil-route-title pageTitle="Home" />,
      <rl-section-with-header>
        <h3 slot="title" role="heading" arial-level="2">Recent Books</h3>
        <div style={{ width: '632px' }}>
          <rl-scrolling-carousel>
            {this.searches.recent.map(s =>
              <rl-card cardData={s.value} hasPrimaryAction>
                <div slot="primary">{s.value}</div>
              </rl-card>
            )}
          </rl-scrolling-carousel>
        </div>
      </rl-section-with-header>,
      <rl-section-with-header>
        <h3 slot="title" role="heading" arial-level="2">Popular Books</h3>
        <div style={{ width: '632px' }}>
          <rl-scrolling-carousel>
            {this.searches.popular.map(s =>
              <rl-card cardData={s.value} hasPrimaryAction>
                <div slot="primary">{s.value}</div>
              </rl-card>
            )}
          </rl-scrolling-carousel>
        </div>
      </rl-section-with-header>,
      <rl-section-with-header>
        <h3 slot="title" role="heading" arial-level="2">Computer Availability</h3>
        <div style={{ width: '632px' }}>
          {this.labs.map(lab => (
            <stencil-route-link url={`/computers/${lab.locName}`}>
              <div>{lab.compAvail} available in {lab.locName}</div>
            </stencil-route-link>
          ))}
        </div>
      </rl-section-with-header>,
    ]);
  }
}
