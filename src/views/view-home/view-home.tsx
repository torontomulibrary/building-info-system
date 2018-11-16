import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';

import { AppData } from '../../interface';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.scss',
})

export class ViewHome {
  @State() loaded = false;

  @Prop({ mutable: true }) appData!: AppData;

  @Event() homeLoaded!: EventEmitter;

  componentWillLoad() {
    this.loaded = true;
  }

  componentDidLoad() {
    this.homeLoaded.emit();
  }

  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--home': true,
        'rula-view--loaded': this.loaded,
      },
    };
  }

  render() {
    if (this.loaded) {
      return ([
        <stencil-route-title title="Home" />,
        <div>
          Welcome to the home screen.
          <a href="#">Tabbable link</a>
          <slot />
        </div>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
