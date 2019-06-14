import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';

import {
  SearchResultItem,
} from '../../interface';

@Component({
  tag: 'rl-search-suggestions',
  styleUrl: 'search-suggestions.scss',
})

export class SearchSuggestions {

  @Element() _root!: HTMLElement;

  @Prop() activeResult?: number;
  @State() activeItem?: HTMLLIElement;

  @State() totalHeight = 0;

  @Prop() isEmptySearch = true;

  @Prop() suggestions: SearchResultItem[] = [];

  @Event() suggestionClicked!: EventEmitter;

  componentDidUpdate() {
    const el = this._root.firstElementChild as HTMLElement;
    this.totalHeight = el && el.offsetHeight || 0;
  }

  render() {
    if (this.suggestions.length > 0) {
      // Render the suggestions as a single list.
      return (
        <Host id="rl-search-suggestions" class="rl-search__results" style={{ height: `${this.totalHeight}px` }}>
          <ul class="mdc-list mdc-list--two-line mdc-list--dense" role="listbox">
            {this.suggestions.map((detail, i) => {
              const listClass = {
                'mdc-list-item': true,
                'mdc-list-item--selected': i === this.activeResult,
                'rl-search__result_item': true,
              };
              return (
                <li class={listClass} role="option"
                    onClick={e => { e.stopImmediatePropagation(); this.suggestionClicked.emit(detail); }}>
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
        </Host>
      );
    } else {
      if (!this.isEmptySearch) {
        return (
          <Host id="rl-search-suggestions" class="rl-search__results" style={{ height: `${this.totalHeight}px` }}>
            <div class="rl-search__no-results">
              No results were found.
            </div>
          </Host>
        );
      }
    }

    return (<Host id="rl-search-suggestions" class="rl-search__results" style={{ height: `${this.totalHeight}px` }} />);
  }
}
