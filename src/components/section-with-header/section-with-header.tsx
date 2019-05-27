import { Component, Element } from '@stencil/core';

@Component({
  tag: 'rl-section_with_header',
  styleUrl: 'section_with_header.scss',
  shadow: true,
})
export class ScrollingCarousel {
  @Element() root!: HTMLRlScrollingCarouselElement;

  hostData() {
    return {
      class: {
        'rl-section_with_header': true,
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
