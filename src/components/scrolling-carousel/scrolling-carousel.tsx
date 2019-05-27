import { Component, Element } from '@stencil/core';

@Component({
  tag: 'rl-scrolling-carousel',
  styleUrl: 'scrolling-carousel.scss',
  shadow: true,
})
export class ScrollingCarousel {
  @Element() root!: HTMLRlScrollingCarouselElement;

  hostData() {
    return {
      class: {
        'rl-scrolling-carousel': true,
      },
    };
  }

  render() {
    return ([
      <div class="rl-scrolling-carousel__wrapper">
        <div class="rl-scrolling-carousel__scroll-wrap">
          <div class="rl-scrolling-carousel__scroller">
            <slot />
          </div>
        </div>
      </div>,
    ]);
  }
}
