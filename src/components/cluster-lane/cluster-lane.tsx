import { FunctionalComponent, h } from '@stencil/core';

import { ClusterData } from '../../interface';
import { getAncestorByClass } from '../../utils/dom';

interface ClusterLaneProps {
  /**
   * An array of CardData objects that will be used to populate the lane with.
   */
  data: ClusterData[];
  /**
   * The number of columns currently visible in the lane.
   */
  columns: number;
  /**
   * A callback that will be fired when the first visible column changes.
   */
  firstVisibleChanged: (newFirstVisible: number) => void;
}

// tslint:disable-next-line:variable-name
export const ClusterLane: FunctionalComponent<ClusterLaneProps> = ({
  data,
  columns,
  firstVisibleChanged,
}) => {
  let laneEl: HTMLDivElement | undefined;
  const handleClick = (e: MouseEvent) => {
    const tgt = e.target as HTMLElement;

    if (tgt && laneEl) {
      if (getAncestorByClass(tgt, 'prev') || getAncestorByClass(tgt, 'next')) {
        const scrollRight = getAncestorByClass(tgt, 'next');
        const laneWidth = laneEl.clientWidth;
        const curScroll = laneEl.scrollLeft;

        let newScroll = curScroll + (scrollRight ? 1 : -1) * laneWidth;
        newScroll = Math.min(Math.max(newScroll, 0), laneEl.scrollWidth - laneWidth);
        const handleScroll = (evt: Event) => {
          const scrollTarget = evt.target as HTMLElement;
          if (laneEl && scrollTarget && scrollTarget.scrollLeft === newScroll) {
            laneEl.removeEventListener('scroll', handleScroll);
            // Scroll done.
            const page = Math.floor(newScroll / laneWidth);
            const overflow = newScroll % laneWidth;
            firstVisibleChanged(page * columns + Math.round(overflow / Math.round(laneWidth / columns)));
          }
        };

        laneEl.addEventListener('scroll', handleScroll);
        laneEl.scrollTo({
          left: newScroll,
          behavior: 'smooth',
        });
      }
    }
  };

  return ([
    <div class="rl-lane__button prev" onClick={handleClick}>
      <svg class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
        <g class="style-scope iron-icon">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </g>
      </svg>
    </div>,
    <div class="rl-lane__content" ref={el => laneEl = el}>
      {data && data.map(item => {
        return (
          <rl-card
            hasPrimaryAction
            primaryLink={item.link}
            cardMedia={item.media}
          >
            <div slot="primary" class="rl-card__detail-inner">
              <a href="" class="rl-card__title rl-card__fade-out" title={item.title}>
                {item.title}
              </a>
            </div>
          </rl-card>
        );
      })}
    </div>,
    <div class="rl-lane__button next" onClick={handleClick}>
      <svg class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
        <g class="style-scope iron-icon">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
        </g>
      </svg>
    </div>,
  ]);
};
