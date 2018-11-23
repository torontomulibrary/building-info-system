import { Component, Element, Listen, Prop } from '@stencil/core';

/**
 * A component that can be used to display a list of header/content items.
 * By default just the header of each item is displayed.  Each item can be
 * expanded when interacted with by the user to display the content.
 */
@Component({
  tag: 'rl-accordion',
  styleUrl: 'accordion.scss',
})

export class Accordion {
  /**
   * An array of the `accordion-item` triggers (buttons) of all child accordion
   * items.
   */
  private _triggers: HTMLButtonElement[] = [];

  /**
   * The root element of this component
   */
  @Element() root!: HTMLElement;

  /**
   * An array of content displayed by the accordion.
   */
  @Prop() items: Array<{ [key: string]: string }> = [];

  /**
   * Flag indicating if multiple `accordion-item`s can be open at once.
   * Defaults to true.
   */
  @Prop() allowMultiple = true;

  /**
   * Component lifecycle function that is called when completely lodaded and
   * entered into the DOM.
   */
  componentDidLoad() {
    this._triggers = Array.prototype.slice.call(
      this.root.querySelectorAll('.rl-accordion-item__trigger'));
  }

  /**
   * Handle when a user presses the up or down arrow while one `accordion-item`
   * is focused.  This moves focus to the next (or previous) item, wrapping
   * around from the first or last element.
   *
   * @param evt The triggering event.
   */
  onKeyDown(evt: KeyboardEvent) {
    const target = evt.target;
    const key = evt.key;

    if (target instanceof HTMLButtonElement && target &&
        target.classList.contains('rl-accordion-item__trigger')) {
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        const index = this._triggers.indexOf(target);
        const dir = (key === 'ArrowDown') ? 1 : -1;
        const len = this._triggers.length;
        const newIndex = (index + len + dir) % len;

        this._triggers[newIndex].focus();

        evt.preventDefault();
      }
    }
  }

  /**
   * Handles when a child `accordion-item` fires a `toggleItem` event.  If the
   * `allowMultiple` flag is `false` then any currently active (open) item will
   * be closed.
   */
  @Listen('toggleItem')
  toggleItemHandler() {
    const active = this.root.querySelector('[aria-expanded]') as HTMLRulaAccordionItemElement;
    if (active && !this.allowMultiple) {
      active.close();
    }
  }

  /**
   * Component render function.
   */
  render() {
    return (
      <dl role="presentation" class="rl-accordion-group"
          onKeyDown={e => { this.onKeyDown(e); }}>
        <slot />
      </dl>
    );
  }
}
