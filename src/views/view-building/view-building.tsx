import { Component, Element, Prop, State } from '@stencil/core';
import { APP_TITLE } from '../../global/constants';
import { LazyStore, Building, BuildingMap } from '../../interface';

import building from '../../reducers/building-reducer';
import { getBuildingData } from '../../actions/building-actions';

@Component({
  tag: 'view-building',
  styleUrl: 'view-building.scss',
  host: {
    theme: 'rula-view rula-view--buildings'
  }
})

export class ViewBuilding {
  /**
   * Callback function used to unsubscribe from the Redux store.
   */
  private storeUnsubscribe: Function;

  /**
   * Root element of this component.
   */
  @Element() root: HTMLElement;

  /**
   * A list of all the Buildings.
   */
  @State() allBuildings: BuildingMap;

  /**
   * The global Redux store.
   */
  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  /**
   * A URL used to access when loading data.
   */
  @Prop() apiUrl: string;

  async componentWillLoad() {
    // Add in the `map` recuder to the Store.
    this.lazyStore.addReducers({building});
    this.storeUnsubscribe = this.lazyStore.subscribe(() =>
      this.stateChanged(this.lazyStore.getState().building)
    );
    
    // Load Map data.
    if (this.apiUrl) {
      this.lazyStore.dispatch(getBuildingData(this.apiUrl));
    } else {
      // Fail preloading with 'Unable to load map data!'
    }

    document.title = `Buildings | ${APP_TITLE}`;
  }

  componentDidUnload() {
    this.storeUnsubscribe();
    document.title = APP_TITLE;
  }

  /**
   * This handles when the state changes.
   * 
   * @param state A copy of the new Redux state.
   */
  stateChanged(state) {
    this.allBuildings = state.allBuildings;
  }

  render() {
    if (!this.allBuildings) return;

    return ([
      <h2 class="rula-view__heading">Building Information</h2>,
      <div class="rula-view__container mdc-layout-grid">
        <div class="mdc-layout-grid__inner">
          {Object.values(this.allBuildings).map((building: Building) => 
            <div class="rula-card mdc-layout-grid__cell mdc-layout-grid__cell--span-6-desktop">
              <div class="rula-card__header rula-card__header--16-9"
                style={{backgroundImage: `url("${building.image}")`}}>
                <div class="rula-card__text-protection"></div>
                <div class="rula-card__header-content">
                  <div class="rula-building__title">{building.name}</div>
                </div>
              </div>
              <div class="rula-card__content">
                <div class="rula-building__description">{building.description}</div>
              </div>
              <div class="rula-card__content-expandable">

              </div>
              <div class="rula-card__actions">
                <a href={`/map/${building.code}`}>
                  <button class="mdc-button rula-event__action">
                    Map it!
                  </button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    ]);
  }
}