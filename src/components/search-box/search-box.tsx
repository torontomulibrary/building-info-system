import { Element, Prop, Component } from '@stencil/core';

import { SearchResult, SearchResultGroup } from '../../interface';

@Component({
  tag: 'rula-search-box',
  styleUrl: 'search-box.scss',
  host: {
    theme: 'rula-search-box'
  }
})

export class RulaDrawer {
  @Element() root: HTMLElement;

  @Prop() id: string = 'searchbox';
  @Prop() searchResults: Array<SearchResult | SearchResultGroup>;

  componentWillLoad() {
    
  }

  componentDidLoad() {
  }

  _renderResults() {
    let items = undefined;

    if (this.searchResults && this.searchResults[0].hasOwnProperty('items')) {
      // We have a list of SearchResultGroups.
      items = (
        <div class='mdc-list-group'>
        {this.searchResults.map(g => {
          let group = g as SearchResultGroup; // Keep TS happy.
          return ([
            <h3 class='mdc-list-group__subheader'>{group.name}</h3>,
            <ul class='mdc-list'>
              {group.items.map(item => 
                <li class='mdc-list-item'>{item.name}</li>
              )}
            </ul>
          ])
        })}
        </div>);
    } else if (this.searchResults && this.searchResults.length > 0) {
      // Render the searchResults as a single list.
      items = (
        <ul class='mdc-list'>
          {this.searchResults.map(i => {
            let item = i as SearchResult;
            return (
              <li class='mdc-list-item'>{item.name}</li>
            )
          })}
        </ul>
      );
    }

    return items;
  }

  render() {
    return ([
      <rula-textfield id={this.id} box full-width leading-icon='search' placeholder='Search'></rula-textfield>,
      <div class='results'>
        {this._renderResults()}
      </div>
    ]);
  }
}
