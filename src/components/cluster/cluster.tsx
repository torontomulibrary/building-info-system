import { Component, Element, Prop, State, h } from '@stencil/core';

import { BASE_URL } from '../../global/config';
import { ROUTES } from '../../global/constants';
import { getAncestorByClass } from '../../utils/dom';

@Component({
  tag: 'rl-cluster',
  styleUrl: 'cluster.scss',
  // shadow: true,
})
export class Cluster {
  @Element() root!: HTMLRlClusterElement;

  @State() firstVisible = 0;
  @State() maxColumns = 8;

  @Prop() type?: string;
  @Prop() heading = '';
  @Prop() data: any;
  @Prop({ reflectToAttr: true }) columns = 5;
  @Prop() hasMore = false;

  componentWillLoad() {
    if (this.data) {
      this.maxColumns = Math.min(this.data.length, this.maxColumns);
    }
  }

  hostData() {
    return {
      class: {
        'rl-cluster': true,
        'has-prev': this.firstVisible > 0 && this.columns < this.data.length,
        'has-next': (this.firstVisible + this.columns) < this.data.length,
      },
    };
  }

  // @Listen('click')
  handleClick(e: Event) {
    const tgt = e.target as HTMLElement;

    if (tgt) {
      if (getAncestorByClass(tgt, 'prev') || getAncestorByClass(tgt, 'next')) {
        const laneEl = this.root.getElementsByClassName('rl-lane__content')[0];
        const scrollRight = getAncestorByClass(tgt, 'next');
        const laneWidth = laneEl.clientWidth;
        const curScroll = laneEl.scrollLeft;

        let newScroll = curScroll + (scrollRight ? 1 : -1) * laneWidth;
        newScroll = Math.min(Math.max(newScroll, 0), laneEl.scrollWidth - laneWidth);
        const handleScroll = (evt: Event) => {
          const scrollTarget = evt.target as HTMLElement;
          if (scrollTarget && scrollTarget.scrollLeft === newScroll) {
            laneEl.removeEventListener('scroll', handleScroll);
            // Scroll done.
            const page = Math.floor(newScroll / laneWidth);
            const overflow = newScroll % laneWidth;
            this.firstVisible = page * this.columns + Math.round(overflow / Math.round(laneWidth / this.columns));
          }
        };

        laneEl.addEventListener('scroll', handleScroll);
        laneEl.scrollTo({
          left: newScroll,
          behavior: 'smooth',
        });
      }
    }
  }

  renderContent() {
    switch (this.type) {
      case 'books':
        return ([
          <div class="rl-lane__content">
            {this.data.map((b: any, i: number) => {
              if (i >= this.firstVisible) {
                return (
                  <rl-card
                    cardTitle={b.Title[0]}
                    cardData={b}
                    titleInMedia
                    noContent
                    hasPrimaryAction
                    cardMedia={b.thumbnail_m ? b.thumbnail_m[0] : undefined}
                    >
                  </rl-card>
                );
              } else {
                return undefined;
              }
            })}
          </div>,
        ]);
      case 'search':
        return ([
          <div class="rl-lane__content">
            {this.data.map(s =>
              <rl-card cardData={s.value} hasPrimaryAction>
                <div slot="primary">{s.value}</div>
              </rl-card>
            )}
          </div>,
        ]);
      case 'computer':
        return ([
          <div class="rl-lane__content">
            {this.data.map(lab =>
              <stencil-route-link url={`${BASE_URL}${ROUTES.COMPUTERS}/${lab.locName}`}>
              <div>{lab.compAvail} available in {lab.locName}</div>
            </stencil-route-link>
            )}
          </div>,
        ]);
      default:
        return undefined;
    }
  }

  render() {
    return ([
      <div class="rl-cluster__header">
        <div class="rl-cluster__header--inner">
          <h2 class="rl-cluster__title">{this.heading}</h2>
        </div>
        {this.hasMore ? <button class="mdc-button">See More</button> : undefined}
      </div>,
      <div class="rl-lane__button prev" onClick={e => this.handleClick(e)}>
        <svg class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
          <g class="style-scope iron-icon">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
          </g>
        </svg>
      </div>,
      this.renderContent(),
      <div class="rl-lane__button next" onClick={e => this.handleClick(e)}>
        <svg class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
          <g class="style-scope iron-icon">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </g>
        </svg>
      </div>,
    ]);
  }
}
