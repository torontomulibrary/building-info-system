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
        'rula-view': true,
        'rula-view--buildings': true,
        'rula-view--loaded': this.loaded && this.appLoaded,
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
        <h2 class="rula-view__heading">Building Information</h2>,
        <div class="rula-view__container mdc-layout-grid">
          <div class="mdc-layout-grid__inner">
            {Object.values(this.buildings).map((building: Building) =>
              <div class="rula-card rula-card--building mdc-layout-grid__cell mdc-layout-grid__cell--span-4-desktop">
                <div class="rula-card__header rula-card__header--16-9"
                  style={{ backgroundImage: `url("${building.image}")` }}>
                  <div class="rula-card__text-protection"></div>
                  <div class="rula-card__header-content">
                    <div class="rula-card__title">{building.name}</div>
                  </div>
                </div>
                <div class="rula-card__content">
                  <div class="rula-card__description">{building.description}</div>
                  <div class="rula-card__expand-icon mdc-button">
                    <i class="material-icons">expand_more</i>
                  </div>
                </div>
                <div class="rula-card__content-expandable">
                  <div class="rula-floor-list">
                    <div class="rula-floor-list__item">
                      <div class="rula-floor-list__header">
                        <div class="rula-floor-list__image"></div>
                        <div class="rula-floor-list__title">8th Floor</div>
                        <div class="rula-floor-list__subtitle">SLC</div>
                        <div class="rula-floor-list__loc-link mdc-button">
                          <i class="material-icons">
                            location_on
                          </i>
                        </div>
                      </div>
                      <div class="rula-floor-list__content">
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
                <div class="rula-card__actions">
                  <a href={`/map/${building.code}`} role="button" class="mdc-button rula-event__action">
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
