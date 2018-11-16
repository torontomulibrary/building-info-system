import { Component, Element, Prop } from '@stencil/core';

@Component({
  tag: 'rula-collection',
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
        'rula-collection': true,
      },
    };
  }

  render() {
    return ([
      <div class="rula-collection__title">
        <h2>{this.collectionTitle}</h2>
        <div class="rula-collection__title-bar"></div>
      </div>,
      <div class="rula-collection__wrapper">
        <div class="rula-collection__scroller">
          <slot />
          <div class="rula-collection__end-pad"></div>
        </div>
      </div>,
    ]);
  }
}
