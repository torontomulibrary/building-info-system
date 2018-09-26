import { Component, Prop } from '@stencil/core';

import {
  Building,
  BuildingMap,
} from '../../interface';

@Component({
  tag: 'view-building',
  styleUrl: 'view-building.scss',
  host: {
    theme: 'rula-view rula-view--buildings',
  },
})

export class ViewBuilding {
  /**
   * A list of all the Buildings.
   */
  @Prop() allBuildings!: BuildingMap;

  render() {
    if (!this.allBuildings) return;

    return ([
      <stencil-route-title title="Buildings" />,
      <h2 class="rula-view__heading">Building Information</h2>,
      <div class="rula-view__container mdc-layout-grid">
        <div class="mdc-layout-grid__inner">
          {Object.values(this.allBuildings).map((building: Building) =>
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
}
