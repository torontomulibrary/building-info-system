import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  // Watch,
} from '@stencil/core';
import { DocumentIndex } from 'ndx-compat';

import {
  CalEvent,
  Faq,
  // FaqMap,
  MapElementDetail,
  // MapElementDetailMap,
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

  @Prop() resultHeight = 0;
  // private allElements!: MapElementMap;

  @Element() root!: HTMLElement;

  // @State() allDetails!: MapElementDetailMap;

  @Prop() id = 'searchbox';
  // @Prop() searchResults: {
  //   location: Array<SearchResults<number>>,
  //   faq: Array<SearchResults<number>>,
  //   event: Array<SearchResults<number>>,
  // } = {
  //   location: [], faq: [], event: [],
  // };

  // @State() searchQuery = '';
  @State() focused = false;
  @State() activeResult?: SearchResults<number>;

  @State() bookResultsRaw = '';
  @State() bookResultsParsed: any;

  // @State() resultHeight = 0;

  @Prop() showMenu = false;

  @Prop() inputPlaceholder = '';

  // @Event() locationSelected!: EventEmitter;
  // @Event() faqSelected!: EventEmitter;
  @Event() searchChange!: EventEmitter;
  @Prop({ reflectToAttr: true, mutable: true }) searchValue = '';

  // @Prop() locationData!: MapElementDetailMap;
  // @Watch('locationData')
  // _onLocationDataChange() {
  //   if (this.locationData) {
  //     Object.values(this.locationData).forEach((d: MapElementDetail) => {
  //       if (this.documentIndexes.location !== undefined) {
  //         this.documentIndexes.location.add(d.id, d);
  //       }
  //     });
  //   }
  // }

  // @Prop() faqData!: FaqMap;
  // @Watch('faqData')
  // _onFaqDataChange() {
  //   if (this.faqData) {
  //     Object.entries(this.faqData).forEach((value: [string, Faq]) => {
  //       if (this.documentIndexes.faq !== undefined) {
  //         this.documentIndexes.faq.add(Number(value[0]), value[1]);
  //       }
  //     });
  //   }
  // }

  @Event() iconClick!: EventEmitter;

  componentWillLoad() {
    this.documentIndexes.location.addField('code');
    this.documentIndexes.location.addField('name');
    this.documentIndexes.location.addField('description');

    this.documentIndexes.faq.addField('question');
  }

  // componentDidUpdate() {
  //   this.resultsChanged();
  // }

  @Method()
  clearInput() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
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
  // onKeyDown(evt: KeyboardEvent) {
  //   const target = evt.target;
  //   const { keyCode, key } = evt;

  //   if (target && target instanceof HTMLInputElement &&
  //       target.classList.contains('rl-search__input') &&
  //       this.searchResults.location.length > 0) {
  //     // if (key === 'ArrowUp' || key === 'ArrowDown') {
  //     //   if (this.activeResult === undefined) {
  //     //     this.activeResult = (key === 'ArrowDown') ?
  //     //         this.searchResults[0] :
  //     //         this.searchResults[(this.searchResults.location.length - 1)];
  //     //   } else {
  //     //     const index = this.searchResults.location.indexOf(this.activeResult);
  //     //     const dir = (key === 'ArrowDown') ? 1 : -1;
  //     //     const len = this.searchResults.location.length;
  //     //     const newIndex = (index + len + dir) % len;

  //     //     this.activeResult = this.searchResults[newIndex];
  //     //   }

  //     //   evt.preventDefault();
  //     // }
  //   } else if (key === 'Escape' || keyCode === 27) {
  //     this.focused = false;
  //     if (this.searchInput) {
  //       this.searchInput.value = '';
  //     }
  //   }
  // }

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
        this.root === target || this._isDecendant(this.root, target)) {
      this.focused = true;
      return;
    }

    this.focused = false;
  }

  hostData() {
    return {
      role: 'search',
      class: {
        'rl-search': true,
        'rl-search--open': this.focused,
        'rl-search--focused': this.focused || this.searchValue !== '',
      },
    };
  }

  render() {
    return ([
      <input id="rl-search-input" role="combobox" aria-autocomplete="list"
          ref={elm => this.searchInput = elm}
          aria-owns="rl-search-suggestions" class="rl-search__input"
          placeholder={(this.showMenu && !this.focused) ? this.inputPlaceholder : 'Search'}
          onFocus={_ => this.focused = true}
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
      <slot name="suggestions" />,
    ]);
  }
}
