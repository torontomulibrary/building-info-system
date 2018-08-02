import { Component } from '@stencil/core';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.scss',
})

export class ViewHome {

  render() {
    return (
      <div>
        Welcome to the home screen.
        <a href="#">Tabbable link</a>
        <slot />
      </div>
    );
  }
}
