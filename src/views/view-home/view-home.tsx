import { Component, Prop, State } from '@stencil/core';

import { AppData } from '../../interface';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.scss',
})

export class ViewHome {
  @State() loaded = false;

  @Prop({ mutable: true }) appData!: AppData;

  @Prop() appLoaded = false;

  componentDidLoad() {
    this.loaded = true;
  }

  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--home': true,
        'rula-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    return ([
      <stencil-route-title title="Home" />,
      <div>
        Welcome to the home screen.
        <a href="#">Tabbable link</a>
        <slot />
      </div>,
    ]);
  }
}
