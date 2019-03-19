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
  CalEvent,
  Faq,
  FaqMap,
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

  private documentIndexes: {
    location: DocumentIndex<number, MapElementDetail>,
    faq: DocumentIndex<number, Faq>,
    event: DocumentIndex<number, CalEvent>,
  } = {
    location: new DocumentIndex(),
    faq: new DocumentIndex(),
    event: new DocumentIndex(),
  };

  private searchInput?: HTMLInputElement;
  // private allElements!: MapElementMap;

  @Element() root!: HTMLElement;

  @State() allDetails!: MapElementDetailMap;

  @State() isOpen = false;

  @Prop() id = 'searchbox';
  @State() searchResults: {
    location: Array<SearchResults<number>>,
    faq: Array<SearchResults<number>>,
    event: Array<SearchResults<number>>,
  } = {
    location: [], faq: [], event: [],
  };

  @State() searchQuery = '';
  @State() focused = false;
  @State() activeResult?: SearchResults<number>;

  @State() bookResultsRaw = '';
  @State() bookResultsParsed: any;

  @State() suggestionHeight = 0;

  @Prop() showMenu = false;

  @Event() locationSelected!: EventEmitter;
  @Event() faqSelected!: EventEmitter;

  @Prop() locationData!: MapElementDetailMap;
  @Watch('locationData')
  _onLocationDataChange() {
    if (this.locationData) {
      Object.values(this.locationData).forEach((d: MapElementDetail) => {
        if (this.documentIndexes.location !== undefined) {
          this.documentIndexes.location.add(d.id, d);
        }
      });
    }
  }

  @Prop() faqData!: FaqMap;
  @Watch('faqData')
  _onFaqDataChange() {
    if (this.faqData) {
      Object.entries(this.faqData).forEach((value: [string, Faq]) => {
        if (this.documentIndexes.faq !== undefined) {
          this.documentIndexes.faq.add(Number(value[0]), value[1]);
        }
      });
    }
  }

  @Event() iconClick!: EventEmitter;

  componentWillLoad() {
    this.documentIndexes.location.addField('code');
    this.documentIndexes.location.addField('name');
    this.documentIndexes.location.addField('description');

    this.documentIndexes.faq.addField('question');
  }

  @Listen('window:click')
  _onGlobalClick(e: Event) {
    e = e;
    // this._checkFocus(e);
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
        this.searchResults.location.length > 0) {
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        if (this.activeResult === undefined) {
          this.activeResult = (key === 'ArrowDown') ?
              this.searchResults[0] :
              this.searchResults[(this.searchResults.location.length - 1)];
        } else {
          const index = this.searchResults.location.indexOf(this.activeResult);
          const dir = (key === 'ArrowDown') ? 1 : -1;
          const len = this.searchResults.location.length;
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

  _onLocationClick(e: Event, detailId: number) {
    this.locationSelected.emit(detailId);
    this.focused = false;
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchResults = { location: [], faq: [], event: [] };
    }
    e.stopImmediatePropagation();
  }

  _onFaqClick(e: Event, faqId: number) {
    this.faqSelected.emit(faqId);
    this.focused = false;
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchResults = { location: [], faq: [], event: [] };
    }
    e.stopImmediatePropagation();
  }

  _onSearchChange(e: Event) {
    const t = e.target;

    if (t !== null && t instanceof HTMLInputElement) {
      this._checkFocus(e);

      if (this.documentIndexes.location !== undefined) {
        this.searchQuery = t.value;
        // this.updateSearchQuery(t.value);
        // Limit to `n` results.
        this.searchResults.location = this.documentIndexes.location.search(t.value).slice(0, 3);
      }
      if (this.documentIndexes.faq !== undefined) {
        this.searchQuery = t.value;
        // this.updateSearchQuery(t.value);
        // Limit to `n` results.
        this.searchResults.faq = this.documentIndexes.faq.search(t.value).slice(0, 3);
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

    if (this.searchResults.location.length > 0) {
      // Render the searchResults as a single list.
      items = (
        <div
            class="mdc-list-group"
            ref={el => this.suggestionHeight = el ? el.clientHeight : 0}>
          <h3 class="mdc-list-group__subheader">Locations</h3>
          <ul class="mdc-list mdc-list--two-line" role="listbox">
            {this.searchResults.location.map(i => {
              const detail = this.locationData[i.docId];
              const listClass = {
                'mdc-list-item': true,
                'mdc-list-item--selected': i === this.activeResult,
                'rl-search__result_item': true,
              };
              return (
                <li class={listClass} role="option" tabIndex={0}
                    onClick={e => { this._onLocationClick(e, i.docId); }}>
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
          <h3 class="mdc-list-group__subheader">FAQs</h3>
          <ul class="mdc-list" role="listbox">
            {this.searchResults.faq.map(i => {
              const detail = this.faqData[i.docId];
              const listClass = {
                'mdc-list-item': true,
                'mdc-list-item--selected': i === this.activeResult,
                'rl-search__result_item': true,
              };
              return (
                <li class={listClass} role="option" tabIndex={0}
                    onClick={e => { this._onFaqClick(e, i.docId); }}>
                  <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">
                      {detail.question}
                    </span>
                    {/* <span class="mdc-list-item__secondary-text">
                      {detail.code}
                    </span> */}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
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
          // onBlur={_ => this.focused = false}
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
