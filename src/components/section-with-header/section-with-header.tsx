import { Component, Element } from '@stencil/core';

@Component({
  tag: 'rl-section-with-header',
  styleUrl: 'section-with-header.scss',
  shadow: true,
})
export class ScrollingCarousel {
  @Element() root!: HTMLRlScrollingCarouselElement;

  hostData() {
    return {
      class: {
        'rl-section-with-header': true,
      },
    };
  }

  render() {
    return ([
      <slot name="title"/>,
      <slot />,
    ]);
  }
}
