import { Component, Element, Host, Prop, State, h } from '@stencil/core';

import { BASE_URL } from '../../global/config';
import { CLUSTER_TYPE, ROUTES } from '../../global/constants';
import { Lane } from '../lane/lane';

@Component({
  tag: 'rl-cluster',
  styleUrl: 'cluster.scss',
})
export class Cluster {
  @Element() root!: HTMLRlClusterElement;

  @State() firstVisible = 0;
  @State() maxColumns = 8;

  @Prop() type?: CLUSTER_TYPE;
  @Prop() heading = '';
  @Prop() data: any;
  @Prop({ reflectToAttr: true }) columns = 5;
  @Prop() hasMore = false;

  componentWillLoad() {
    if (this.data) {
      this.maxColumns = Math.min(this.data.length, this.maxColumns);
    }
  }

  renderContent() {
    switch (this.type) {
      case CLUSTER_TYPE.CARD:
        return (
          <Lane
            data={this.data}
            columns={this.columns}
            firstVisible={0}
            firstVisibleChanged={fv => { this.firstVisible = fv; }}
          >
          </Lane>
        );
      case CLUSTER_TYPE.LIST:
      default:
        return (
          <div class="mdc-list">
            {this.data.map(lab =>
              <stencil-route-link url={`${BASE_URL}${ROUTES.COMPUTERS}/${lab.locName}`}>
                <div>{lab.compAvail} available in {lab.locName}</div>
              </stencil-route-link>
            )}
          </div>
        );
    }
  }

  render() {
    return (
      <Host class={{
        'rl-cluster': true,
        'has-prev': this.firstVisible > 0 && this.columns < this.data.length,
        'has-next': (this.firstVisible + this.columns) < this.data.length,
      }}>
        <div class="rl-cluster__header">
          <div class="rl-cluster__header--inner">
            <h2 class="rl-cluster__title">{this.heading}</h2>
          </div>
          {this.hasMore ? <button class="mdc-button">See More</button> : undefined}
        </div>
        {this.renderContent()}
      </Host>
    );
  }
}
