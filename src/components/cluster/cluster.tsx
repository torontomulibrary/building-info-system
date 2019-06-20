import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';

import { ClusterData } from '../../interface';
import { ClusterGrid } from '../cluster-grid/cluster-grid';
import { ClusterLane } from '../cluster-lane/cluster-lane';

@Component({
  tag: 'rl-cluster',
  styleUrl: 'cluster.scss',
})
export class Cluster {
  @Element() root!: HTMLRlClusterElement;

  @State() firstVisible = 0;
  @State() maxColumns = 8;

  @Prop() heading = '';
  @Prop() data?: ClusterData[];
  @Prop({ reflectToAttr: true }) columns = 2;
  @Prop() hasMore = false;
  @Prop() parentEl?: HTMLElement;
  @Prop() isMobile = false;

  componentWillLoad() {
    if (this.data) {
      this.maxColumns = Math.min(this.data.length, this.maxColumns);
    }
  }

  componentDidLoad() {
    this.updateWidth();
  }

  updateWidth() {
    if (this.parentEl) {
      const width = this.parentEl.clientWidth - 128;
      this.columns =
        this.isMobile ? 2 :
        700 > width ? 3 :
        928 > width ? 4 :
        1160 > width ? 5 :
        1392 > width ? 6 :
        1624 > width ? 7 : 8;
    }
  }

  @Listen('resize', { target: 'window' })
  onresize() {
    this.updateWidth();
  }

  renderContent() {
    if (this.data) {
      switch (this.data[0].type) {
        case 'card':
          if (this.isMobile) {
            return (
              <ClusterGrid
                data={this.data.slice(0, 4)}
              >
              </ClusterGrid>
            );
          } else {
            return (
              <ClusterLane
                data={this.data}
                columns={this.columns}
                firstVisibleChanged={fv => { this.firstVisible = fv; }}
              >
              </ClusterLane>
            );
          }
        case 'list':
        default:
          return (
            <div class="mdc-list mdc-list--two-line" role="list">
              {this.data.map(d =>
                <stencil-route-link anchorClass="mdc-list-item" role="listitem" url={d.link}>
                  <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">{d.title}</span>
                    <span class="mdc-list-item__secondary-text">{d.subTitle}</span>
                  </span>
                </stencil-route-link>
              )}
            </div>
          );
      }
    }
  }

  render() {
    return (
      <Host class={{
        'rl-cluster': true,
        'has-prev': this.data ? this.firstVisible > 0 && this.columns < this.data.length : false,
        'has-next': this.data ? (this.firstVisible + this.columns) < this.data.length : false,
      }}>
        <div class="rl-cluster__header">
          <div class="rl-cluster__header--inner">
            <h2 class="rl-cluster__title mdc-typography--headline5">{this.heading}</h2>
          </div>
          {this.hasMore ? <button class="mdc-button">See More</button> : undefined}
        </div>
        {this.renderContent()}
      </Host>
    );
  }
}
