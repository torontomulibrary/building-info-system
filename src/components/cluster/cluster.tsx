import { Component, Host, Prop, State, h } from '@stencil/core';

import { ClusterData } from '../../interface';
import { ClusterGrid } from '../cluster-grid/cluster-grid';
import { ClusterLane } from '../cluster-lane/cluster-lane';

/**
 * An object used to display a related group of data with a common title.  Items
 * are displayed using cards or a list.  Card can be arranged in a lane (single
 * row with left and right scroll buttons), or in a grid.
 */
@Component({
  tag: 'rl-cluster',
  styleUrl: 'cluster.scss',
})
export class Cluster {
  /**
   * The first item currently visible, used to determine if the previous nav
   * arrow is displayed.
   */
  @State() firstVisible = 0;
  /**
   * The maximum number of columns in a lane or grid.
   */
  @State() maxColumns = 8;

  /**
   * The title of the cluster.
   */
  @Prop() heading = '';

  /**
   * The array of data displayed in the cluster.
   */
  @Prop() data?: ClusterData[];

  /**
   * The number of columns the cluster has.  This only effects lane and grid
   * clusters.
   */
  @Prop({ reflectToAttr: true }) columns = 2;

  /**
   * A flag indicating if a 'See All' button should be displayed, taking the
   * user to a list of all rleated items as the cluster is used to only show
   * an abbreviated list.
   */
  @Prop() hasMore = false;

  /**
   * The
   */
  // @Prop() parentEl?: HTMLElement;

  /**
   * Flag indicating if the cluster is displayed on mobile device or not.
   */
  @Prop() isMobile = false;

  componentWillLoad() {
    if (this.data) {
      this.maxColumns = Math.min(this.data.length, this.maxColumns);
    }
  }

  /**
   * Render the content of this Cluster.
   */
  renderContent() {
    if (this.data !== undefined && this.data.length > 0) {
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
