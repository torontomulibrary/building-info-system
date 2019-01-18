import { newE2EPage } from '@stencil/core/testing';

describe('accordion', () => {
  let page;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent('<rl-accordion></rl-accordion>');
  });

  it('renders', async () => {
    const element = await page.find('rl-accordion');
    expect(element).toHaveClasses(['hydrated', 'rl-accordion']);
  });
});
