// import { Component, Element, Host, Prop, State, h, } from '@stencil/core';
import { FunctionalComponent, h } from '@stencil/core';

import { CardData } from '../../interface';
import { getAncestorByClass } from '../../utils/dom';

interface LaneProps {
  data: CardData[];
  columns: number;
  firstVisible: number;
  firstVisibleChanged: (newFirstVisible: number) => void;
}

// tslint:disable-next-line:variable-name
export const Lane: FunctionalComponent<LaneProps> = ({
  data,
  columns,
  firstVisibleChanged,
}) => {
  let laneEl: HTMLDivElement | undefined;
  const handleClick = (e: MouseEvent) => {
    const tgt = e.target as HTMLElement;

    if (tgt && laneEl) {
      if (getAncestorByClass(tgt, 'prev') || getAncestorByClass(tgt, 'next')) {
        // const laneEl = this.root.getElementsByClassName('rl-lane__content')[0];
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
            // firstVisible = page * columns + Math.round(overflow / Math.round(laneWidth / columns));
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
            cardTitle={item.title}
            cardData={item}
            titleInMedia
            noContent
            hasPrimaryAction
            primaryLink={item.link}
            cardMedia={item.media}
          >
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

// @Component({
//   tag: 'rl-lane',
// })
// export class Lane {
//   @Element() root!: HTMLRlLaneElement;

//   @State() firstVisible = 0;
//   @State() maxColumns = 8;

//   @Prop() data?: CardData[];
//   @Prop({ reflectToAttr: true }) columns = 5;

//   handleClick(e: Event) {
    // const tgt = e.target as HTMLElement;

    // if (tgt) {
    //   if (getAncestorByClass(tgt, 'prev') || getAncestorByClass(tgt, 'next')) {
    //     const laneEl = this.root.getElementsByClassName('rl-lane__content')[0];
    //     const scrollRight = getAncestorByClass(tgt, 'next');
    //     const laneWidth = laneEl.clientWidth;
    //     const curScroll = laneEl.scrollLeft;

    //     let newScroll = curScroll + (scrollRight ? 1 : -1) * laneWidth;
    //     newScroll = Math.min(Math.max(newScroll, 0), laneEl.scrollWidth - laneWidth);
    //     const handleScroll = (evt: Event) => {
    //       const scrollTarget = evt.target as HTMLElement;
    //       if (scrollTarget && scrollTarget.scrollLeft === newScroll) {
    //         laneEl.removeEventListener('scroll', handleScroll);
    //         // Scroll done.
    //         const page = Math.floor(newScroll / laneWidth);
    //         const overflow = newScroll % laneWidth;
    //         this.firstVisible = page * this.columns + Math.round(overflow / Math.round(laneWidth / this.columns));
    //       }
    //     };

    //     laneEl.addEventListener('scroll', handleScroll);
    //     laneEl.scrollTo({
    //       left: newScroll,
    //       behavior: 'smooth',
    //     });
    //   }
    // }
//   }

//   render() {
//     return (
//       <Host>
        // <div class="rl-lane__button prev" onClick={e => this.handleClick(e)}>
        //   <svg class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
        //     <g class="style-scope iron-icon">
        //       <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        //     </g>
        //   </svg>
        // </div>
        // <div class="rl-lane__content">
        //   {this.data && this.data.map(item => {
        //     return (
        //       <rl-card
        //         cardTitle={item.title}
        //         // cardData={item}
        //         titleInMedia
        //         noContent
        //         hasPrimaryAction
        //         primaryLink={item.link}
        //         cardMedia={item.media}
        //       >
        //       </rl-card>
        //     );
        //   })}
        // </div>
        // <div class="rl-lane__button next" onClick={e => this.handleClick(e)}>
        //   <svg class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
        //     <g class="style-scope iron-icon">
        //       <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
        //     </g>
        //   </svg>
        // </div>
//       </Host>
//     );
//   }
// }
