import { Component, Element, Prop } from '@stencil/core';

@Component({
  tag: 'rl-collection',
  styleUrl: 'collection.scss',
})
export class Collection {
  /**
   * @emits resultSelected
   */

  @Element() root!: HTMLStencilElement;

  @Prop() collectionTitle = '';

  hostData() {
    return {
      class: {
        'rl-collection': true,
      },
    };
  }

  render() {
    return ([
      <div class="rl-collection__title">
        <h2>{this.collectionTitle}</h2>
        <div class="rl-collection__title-bar"></div>
      </div>,
      <div class="rl-collection__wrapper">
        <div class="rl-collection__scroller">
          <slot />
          <div class="rl-collection__end-pad"></div>
        </div>
      </div>,
    ]);
  }
}
