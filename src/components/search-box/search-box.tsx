import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { DocumentIndex } from 'ndx';

import {
  MapElementDetail,
  MapElementDetailMap,
  SearchResults,
} from '../../interface';

@Component({
  tag: 'rl-search-box',
  styleUrl: 'search-box.scss',
})

export class SearchBox {
  /**
   * @emits resultSelected
   */

  private searchElements?: DocumentIndex<number, MapElementDetail>;
  private searchInput?: HTMLInputElement;
  // private allElements!: MapElementMap;

  @Element() root!: HTMLElement;

  @State() allDetails!: MapElementDetailMap;

  @State() isOpen = false;

  @Prop() id = 'searchbox';
  @State() searchResults: Array<SearchResults<number>> = [];
  @State() searchQuery = '';
  @State() focused = false;
  @State() activeResult?: SearchResults<number>;

  @State() bookResultsRaw = '';
  @State() bookResultsParsed: any;

  @State() suggestionHeight = 0;

  @Prop() showMenu = false;

  @Event() resultSelected!: EventEmitter;

  @Prop() searchData!: MapElementDetailMap;
  @Watch('searchData')
  _onSearchDataChange() {
    if (this.searchData) {
      Object.values(this.searchData).forEach((d: MapElementDetail) => {
        if (this.searchElements !== undefined) {
          this.searchElements.add(d.id, d);
        }
      });
    }
  }

  @Event() iconClick!: EventEmitter;

  componentWillLoad() {
    this.searchElements = new DocumentIndex();
    this.searchElements.addField('code');
    this.searchElements.addField('name');
    this.searchElements.addField('description');
  }

  @Listen('window:click')
  _onGlobalClick(e: Event) {
    this._checkFocus(e);
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
    const { keyCode, key } = evt;

    if (target && target instanceof HTMLInputElement &&
        target.classList.contains('rl-search__input') &&
        this.searchResults && this.searchResults.length > 0) {
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        if (this.activeResult === undefined) {
          this.activeResult = (key === 'ArrowDown') ?
              this.searchResults[0] :
              this.searchResults[(this.searchResults.length - 1)];
        } else {
          const index = this.searchResults.indexOf(this.activeResult);
          const dir = (key === 'ArrowDown') ? 1 : -1;
          const len = this.searchResults.length;
          const newIndex = (index + len + dir) % len;

          this.activeResult = this.searchResults[newIndex];
        }

        evt.preventDefault();
      }
    } else if (key === 'Escape' || keyCode === 27) {
      this.focused = false;
      if (this.searchInput) {
        this.searchInput.value = '';
      }
    }
  }

  _onIconClick() {
    this.iconClick.emit();
  }

  _onResultClick(e: Event, detailId: number) {
    this.resultSelected.emit(detailId);
    this.focused = false;
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchResults = [];
    }
    e.stopImmediatePropagation();
  }

  _onSearchChange(e: Event) {
    const t = e.target;

    if (t !== null && t instanceof HTMLInputElement) {
      this._checkFocus(e);

      if (this.searchElements !== undefined) {
        this.searchQuery = t.value;
        // this.updateSearchQuery(t.value);
        // Limit to `n` results.
        this.searchResults = this.searchElements.search(t.value).slice(0, 3);
      }
    }
  }

  _isDecendant(parent: Element, child: Element) {
    let node = child.parentNode;

    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }

  _checkFocus(e: Event) {
    const target = e.target as Element;

    if (target && target instanceof Element &&
        this._isDecendant(this.root, target)) {
      this.focused = true;
      return;
    }

    this.focused = false;
  }

  _renderResults() {
    let items;
    this.suggestionHeight = 0;

    if (this.searchResults && this.searchResults.length > 0) {
      // Render the searchResults as a single list.
      items = (
        <ul ref={el => this.suggestionHeight = el ? el.clientHeight : 0}
            class="mdc-list mdc-list--two-line" role="listbox">
          {this.searchResults.map(i => {
            const detail = this.searchData[i.docId];
            const listClass = {
              'mdc-list-item': true,
              'mdc-list-item--selected': i === this.activeResult,
              'rl-search__result_item': true,
            };
            return (
              <li class={listClass} role="option" tabIndex={0}
                  onClick={e => { this._onResultClick(e, i.docId); }}>
                <span class="mdc-list-item__text">
                  <span class="mdc-list-item__primary-text">
                    {detail.name}
                  </span>
                  <span class="mdc-list-item__secondary-text">
                    {detail.code}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      );
    } else {
      if (this.searchQuery !== '') {
        return (
          <div ref={el => this.suggestionHeight = el ? el.clientHeight : 0}
              class="rl-search__no-results">
            No results were found.
          </div>
        );
      }
    }

    return items;
  }

  hostData() {
    return {
      role: 'search',
      class: {
        'rl-search': true,
        'rl-search--open': (this.focused),
      },
    };
  }

  render() {
    return ([
      <input id="rl-search-input" role="combobox" aria-autocomplete="list"
          ref={elm => this.searchInput = elm}
          aria-owns="rl-search-suggestions" class="rl-search__input"
          placeholder={(this.showMenu && !this.focused) ? 'RULA Finder' : 'Search'}
          onInput={e => this._onSearchChange(e)}
          onFocus={_ => this.focused = true}
          onBlur={_ => this.focused = false}
          onKeyDown={e => { this.onKeyDown(e); }}></input>,
      <div class="material-icons rl-search__icon"
          onClick={_ => this._onIconClick()}
          role="button">
        {this.showMenu ? 'menu' : 'search'}
      </div>,
      <div id="rl-search-suggestions" class="rl-search__results"
          style={{ height: `${this.suggestionHeight}px` }}>
        {this._renderResults()}
      </div>,
    ]);
  }
}
