import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

import {
  SearchResultItem,
} from '../../interface';
import { Search } from '../../utils/search';

@Component({
  tag: 'rl-search-box',
  styleUrl: 'search-box.scss',
})

export class SearchBox {
  /**
   * @emits resultSelected
   */

  private searchInput?: HTMLInputElement;

  @Prop() resultHeight = 0;

  @Element() root!: HTMLElement;

  @Prop() id = 'searchbox';

  @State() focused = false;
  @State() activeResult?: number;

  // @State() bookResultsRaw = '';
  // @State() bookResultsParsed: any;

  @Prop() showMenu = false;

  @Prop() placeholder = 'Search';

  @Event() searchChange!: EventEmitter;
  @Prop({ reflectToAttr: true, mutable: true }) searchValue = '';

  @State() searchResults: SearchResultItem[] = [];

  @Prop() docSearch!: Search;

  @Event() iconClick!: EventEmitter;

  @Method()
  async clearInput() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
  }

  @Listen('click', { target: 'window' })
  @Listen('focus', { capture: true, target: 'window' })
  _checkFocus(e: Event) {
    const target = e.target as Element;

    if (target && target instanceof Element &&
        this.root === target || this._isDecendant(this.root, target)) {
      this.focused = true;
      return;
    }

    this.focused = false;
  }

  /**
   * Handle when a user presses the up or down arrow while one `accordion-item`
   * is focused.  This moves focus to the next (or previous) item, wrapping
   * around from the first or last element.
   *
   * @param evt The triggering event.
   */
  onKeyDown(evt: KeyboardEvent) {
    const { key } = evt;

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      if (this.activeResult === undefined) {
        this.activeResult = (key === 'ArrowDown') ?
            0 : this.searchResults.length - 1;
      } else {
        const index = this.activeResult;
        const dir = (key === 'ArrowDown') ? 1 : -1;
        const len = this.searchResults.length;
        this.activeResult = (index + len + dir) % len;
      }

      evt.preventDefault();
    } else if (key === 'Escape') {
      this.focused = false;
      if (this.searchInput) {
        this.searchInput.value = '';
      }
    }
  }

  @Listen('suggestionClicked')
  onSuggestionClicked() {
    this.focused = false;
    this.searchValue = '';
  }

  @Listen('input')
  onInput(e: Event) {
    e.stopImmediatePropagation();

    const t = e.target;

    if (t !== null && t instanceof HTMLInputElement) {
      this.searchValue = t.value;
      this.searchResults = this.docSearch.search(this.searchValue, 6);
    }
  }

  _isDecendant(parent: Element, child: Element) {
    let node = child.parentNode;

    while (node) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }

  hostData() {
    return {
      role: 'search',
      class: {
        'rl-search': true,
        'rl-search--open': this.focused,
        'rl-search--focused': this.focused || this.searchValue !== '',
      },
      onKeyDown: (e: KeyboardEvent) => this.onKeyDown(e),
    };
  }

  render() {
    return ([
      <input id="rl-search-input" role="combobox" aria-autocomplete="list"
          ref={elm => this.searchInput = elm}
          aria-owns="rl-search-suggestions" class="rl-search__input"
          placeholder={this.placeholder}
          autocomplete="off"
          value={this.searchValue}
      >
      </input>,
      <div class="material-icons rl-search__icon"
          onClick={_ => this.iconClick.emit()}
          role="button"
          tabindex={this.showMenu ? '0' : undefined}>
        {this.showMenu ? 'menu' : 'search'}
      </div>,
      <rl-search-suggestions
        suggestions={this.searchResults}
        isEmptySearch={this.searchValue === ''}
        activeResult={this.activeResult}
      >
      </rl-search-suggestions>,
    ]);
  }
}
