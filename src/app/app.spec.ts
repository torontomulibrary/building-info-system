import { RLApp } from './app';

describe('application', () => {
  it('builds', () => {
    expect(new RLApp()).toBeTruthy();
  });
});
