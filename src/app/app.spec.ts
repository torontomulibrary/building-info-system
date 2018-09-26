import { render } from '@stencil/core/testing';

import { App } from './app';

describe('rula-bis', () => {
  it('should build', () => {
    expect(new App()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [App],
        html: '<rula-bis></rula-bis>',
      });
    });
  });
});
