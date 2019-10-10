import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';
import { RouterHistory, injectHistory } from '@stencil/router';

import { API_URL, BASE_URL } from '../../global/config';
import { APP_DATA, ROUTES } from '../../global/constants';
import { SearchResultItem } from '../../interface';
import { Search } from '../../utils/search';

@Component({
  tag: 'rl-search-box',
  styleUrl: 'search-box.scss',
})
export class SearchBox {
  /**
   * @emits resultSelected
   */

  /**
   * Reference to the input element.
   */
  private searchInput?: HTMLInputElement;

  /**
   * Height of the search results list.
   */
  // @Prop() resultHeight = 0;

  /**
   * Reference to the root of this component.
   */
  @Element() root!: HTMLElement;

  /**
   * Flag indicating if the search box or its descendant has focus.
   */
  @State() focused = false;

  /**
   * The currently active/selected/highlighted search suggestion.
   */
  @State() activeResult?: number;

  /**
   * The list of search suggestions.
   */
  @State() searchResults: SearchResultItem[] = [];

  /**
   * Flag indicating if the menu icon should be displayed instead of the search
   * icon.  This is needed when the search box extends the entire app bar and
   * there is no room for the drawer icon.
   */
  @Prop() showMenu = false;

  /**
   * Placeholder text for when the input is empty.
   */
  @Prop() placeholder = 'Search';

  /**
   * The current value of the search input.
   */
  @Prop({ reflectToAttr: true, mutable: true }) searchValue = '';

  /**
   * The object used to perform text searches.
   */
  @Prop() docSearch!: Search;

  /**
   * Reference to the Stencil history object.
   */
  @Prop() history?: RouterHistory;

  /**
   * Event fired when the user clicks the search/menu icon.  This is needed to
   * allow the menu to open the drawer.
   */
  @Event() iconClick!: EventEmitter;

  /**
   * Event fired when the text input is changed.
   */
  @Event() searchChange!: EventEmitter;

  /**
   * Clear the current input value.
   */
  @Method()
  async clearInput() {
    if (this.searchInput) {
      this.searchValue = '';
      this.searchInput.value = '';
    }
  }

  /**
   * Handle any events that could potentially cause the search box to lose
   * focus.
   *
   * @param e Triggering event
   */
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
    } else if (key === 'Enter') {
      // Submit the search query as-is.
      this.focused = false;
      if (this.history && this.searchInput) {
        const val = this.searchInput.value;
        fetch(`${API_URL}${APP_DATA.HISTORY}`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: 'term=' + val,
        });
        this.history.push(`${BASE_URL}${ROUTES.SEARCH}/${val}`);
      }
    }
  }

  /**
   * Handle when a search suggestion is clicked.
   */
  @Listen('suggestionClicked')
  onSuggestionClicked() {
    this.focused = false;
    this.searchValue = '';
  }

  /**
   * Handle when the value of the input element changes.
   * @param e The triggering event
   */
  @Listen('input')
  onInput(e: Event) {
    e.stopImmediatePropagation();

    const t = e.target;

    if (t !== null && t instanceof HTMLInputElement) {
      this.searchValue = t.value;
      this.searchResults = this.docSearch.search(this.searchValue, 6);
    }
  }

  /**
   * Checks if the given parent has the given child as a child.
   * @param parent An element
   * @param child An element
   */
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

  render() {
    return (
      <Host role="search" class={{
        'rl-search': true,
        'rl-search--open': this.focused,
        'rl-search--focused': this.focused || this.searchValue !== '',
      }} onKeyDown={(e: KeyboardEvent) => this.onKeyDown(e)}>
        <input id="rl-search-input" role="combobox" aria-autocomplete="list"
            ref={elm => this.searchInput = elm}
            aria-owns="rl-search-suggestions" class="rl-search__input"
            placeholder={this.placeholder}
            autocomplete="off"
            value={this.searchValue}
        >
        </input>
        <div class="material-icons rl-search__icon"
            onClick={_ => this.iconClick.emit()}
            role="button"
            tabindex={this.showMenu ? '0' : undefined}>
          {this.showMenu ? 'menu' : 'search'}
        </div>
        <rl-search-suggestions
          suggestions={this.searchResults}
          isEmptySearch={this.searchValue === ''}
          activeResult={this.activeResult}
        >
        </rl-search-suggestions>
      </Host>
    );
  }
}

// Connect the component with Stencil History object.
injectHistory(SearchBox);
