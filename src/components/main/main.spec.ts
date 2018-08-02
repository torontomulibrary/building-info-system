import { render } from '@stencil/core/testing';
import { Main } from './main';

describe('rula-bis', () => {
  it('should build', () => {
    expect(new Main()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [Main],
        html: '<rula-bis></rula-bis>'
      });
    });
  });
});