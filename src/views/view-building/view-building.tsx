import { Component, Prop, State } from '@stencil/core';

import { BUILDINGS_STORAGE_KEY } from '../../global/constants';
import { Building, BuildingMap } from '../../interface';
import { loadData } from '../../utils/load-data';

@Component({
  tag: 'view-building',
  styleUrl: 'view-building.scss',
})

export class ViewBuilding {
  /**
   * Internal list of Buildings to display.
   */
  @State() buildings?: BuildingMap;

  /**
   * A flag indicating if this view loaded all the data needed to display.
   */
  @State() loaded = false;

  /**
   * Global flag indicating if the whole application has loaded.  If not, this
   * view should not display either.
   */
  @Prop() appLoaded = false;

  /**
   * Lifecycle event fired when the component is first initialized and not
   * yet in the DOM.
   */
  componentWillLoad() {
    // Start loading the Buildings.
    loadData('buildings', BUILDINGS_STORAGE_KEY).then((blds: BuildingMap) => {
      this.buildings = blds;
      this.loaded = true;
    }, reason => {
      console.log(reason);
    });
  }

  /**
   * Dynamically sets host element attributes.
   */
  hostData() {
    return {
      class: {
        'rl-view': true,
        'rl-view--buildings': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  /**
   * Component render function.
   */
  render() {
    if (this.buildings) {

      return ([
        <stencil-route-title pageTitle="Buildings" />,
        <h2 class="rl-view__heading">Building Information</h2>,
        <div class="rl-view__container mdc-layout-grid">
          <div class="mdc-layout-grid__inner">
            {Object.values(this.buildings).map((building: Building) =>
              <div class="rl-card rl-card--building mdc-layout-grid__cell mdc-layout-grid__cell--span-4-desktop">
                <div class="rl-card__header rl-card__header--16-9"
                  style={{ backgroundImage: `url("${building.image}")` }}>
                  <div class="rl-card__text-protection"></div>
                  <div class="rl-card__header-content">
                    <div class="rl-card__title">{building.name}</div>
                  </div>
                </div>
                <div class="rl-card__content">
                  <div class="rl-card__description">{building.description}</div>
                  <div class="rl-card__expand-icon mdc-button">
                    <i class="material-icons">expand_more</i>
                  </div>
                </div>
                <div class="rl-card__content-expandable">
                  <div class="rl-floor-list">
                    <div class="rl-floor-list__item">
                      <div class="rl-floor-list__header">
                        <div class="rl-floor-list__image"></div>
                        <div class="rl-floor-list__title">8th Floor</div>
                        <div class="rl-floor-list__subtitle">SLC</div>
                        <div class="rl-floor-list__loc-link mdc-button">
                          <i class="material-icons">
                            location_on
                          </i>
                        </div>
                      </div>
                      <div class="rl-floor-list__content">
                        <div>The top floor of the SLC is dedicated to group and individual study with open-access carrels and twenty bookable study rooms.</div>
                        <h3>Features</h3>
                        <ul>
                          <li>Collaborative &amp; Group Work Rooms</li>
                          <li>Collaborative Work Space</li>
                          <li>Individual Study Space</li>
                          <li>Open Study Space</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rl-card__actions">
                  <a href={`/map/${building.code}`} role="button" class="mdc-button rl-event__action">
                    Map it!
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
