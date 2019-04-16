import { Component, Element, Prop, State } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.scss',
})

export class ViewHome {
  @Element() root!: HTMLElement;

  @State() loaded = false;

  // @Prop({ mutable: true }) appData!: AppData;

  @Prop() appLoaded = false;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentDidLoad() {
    this.checkSize();
  }

  checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this.checkSize();
      });
    } else {
      this.loaded = true;
    }
  }

  hostData() {
    return {
      class: {
        'rl-view': true,
        'rl-view--home': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    return ([
      <stencil-route-title pageTitle="Home" />,
      <div>
        Welcome to the home screen.
        <a href="#">Tabbable link</a>
        <slot />
      </div>,
    ]);
  }
}
