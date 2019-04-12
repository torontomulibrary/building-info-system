import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
} from '@stencil/core';

import {
  // Faq,
  // MapElementDetail,
  SearchResultItem,
  // SearchResults,
} from '../../interface';

@Component({
  tag: 'rl-search-suggestions',
  styleUrl: 'search-suggestions.scss',
})

export class SearchSuggestions {

  @Element() _root!: HTMLElement;

  @State() activeResult?: number;
  @State() totalHeight = 0;

  @Prop() isEmptySearch = true;
  // @Prop() suggestions: [{
  //   location: MapElementDetail[],
  //   faq: Faq[],
  //   event: Array<SearchResults<number>>,
  // } = {
  //   location: [], faq: [], event: [],
  // };]
  @Prop() suggestions: SearchResultItem[] = [];

  @Event() locationClick!: EventEmitter;
  @Event() faqFlick!: EventEmitter;
  @Event() resultClick!: EventEmitter;

  componentDidUpdate() {
    const el = this._root.firstElementChild as HTMLElement;
    this.totalHeight = el && el.offsetHeight || 0;
  }

  @Listen('window:keydown')
  onKeydown(evt: KeyboardEvent) {
    // const target = evt.target;
    const { key } = evt;

    // if (target && target instanceof HTMLInputElement &&
    //     target.classList.contains('rl-search__input') &&
    //     this.suggestions.length > 0) {
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      if (this.activeResult === undefined) {
        this.activeResult = (key === 'ArrowDown') ?
            0 : this.suggestions.length - 1;
      } else {
        const index = this.activeResult;
        const dir = (key === 'ArrowDown') ? 1 : -1;
        const len = this.suggestions.length;
        this.activeResult = (index + len + dir) % len;
      }

      evt.preventDefault();
    }
    // }
    // } else if (key === 'Escape' || keyCode === 27) {
    //   // this.focused = false;
    //   // if (this.searchInput) {
    //   //   this.searchInput.value = '';
    //   // }
    // }
  }

  hostData() {
    return {
      id: 'rl-search-suggestions',
      class: {
        'rl-search__results': true,
      },
      style: {
        height: `${this.totalHeight}px`,
      },
    };
  }

  render() {
    let items;

    if (this.suggestions.length > 0) {
      // Render the suggestions as a single list.
      items = (
        <ul class="mdc-list mdc-list--two-line mdc-list--dense" role="listbox">
          {this.suggestions.map((detail, i) => {
            const listClass = {
              'mdc-list-item': true,
              'mdc-list-item--selected': i === this.activeResult,
              'rl-search__result_item': true,
            };
            return (
              <li class={listClass} role="option" tabIndex={0}
                  onClick={e => { e.stopImmediatePropagation(); this.resultClick.emit(detail); }}>
                <span class="mdc-list-item__graphic material-icons"
                    aria-hidden="true">
                    {detail.type}
                </span>
                <span class="mdc-list-item__text">
                  <span class="mdc-list-item__primary-text">
                    {detail.value}
                  </span>
                  <span class="mdc-list-item__secondary-text">
                    {detail.type}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      );
    } else {
      if (!this.isEmptySearch) {
        return (
          <div class="rl-search__no-results">
            No results were found.
          </div>
        );
      }
    }

    return items;
  }
}
