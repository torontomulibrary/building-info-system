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
  /**
   * Object to map detail type to display names.
   */
  private detailStrings = {
    'business': 'Building',
    'book': 'Book',
    'question_answer': 'FAQ',
    'location_on': 'Location',
    'event': 'Event',
  };

  /**
   * Reference to the root element.
   */
  @Element() _root!: HTMLElement;

  /**
   * The height required to display all the suggestions.
   */
  @State() totalHeight = 0;

  /**
   * The currently active/highlighted/focused search suggestion.
   */
  @Prop() activeResult?: number;

  /**
   * Flag indicating if there are no search suggestions (even though there
   * is a search query).
   */
  @Prop() isEmptySearch = true;

  /**
   * The list of search suggestions.
   */
  @Prop() suggestions: SearchResultItem[] = [];

  /**
   * Event fired when the user selects one of the search suggestions.
   */
  @Event() suggestionClicked!: EventEmitter<SearchResultItem>;

  /**
   * Component lifecylce event fired once the component has rendered after each
   * update.
   */
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
                      {this.detailStrings[detail.type]}
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
