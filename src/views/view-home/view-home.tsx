import { Component } from '@stencil/core';

import { APP_TITLE } from '../../global/constants';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.scss',
})

export class ViewHome {

  componentDidLoad() {
    document.title = APP_TITLE;
  }

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
