import { Component, Prop, State } from '@stencil/core';

import { BASE_URL } from '../../global/config';
import {
  BUILDINGS_STORAGE_KEY,
  FLOORS_STORAGE_KEY,
  ROUTES,
} from '../../global/constants';
import { Building, BuildingMap, Floor, FloorMap } from '../../interface';
import { loadData } from '../../utils/load-data';

@Component({
  tag: 'view-building',
  styleUrl: 'view-building.scss',
})

export class ViewBuilding {
  /**
   * Internal list of Buildings to display.
   */
  @State() buildings!: BuildingMap;

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
  async componentWillLoad() {
    // Start loading the Buildings.
    loadData('buildings', BUILDINGS_STORAGE_KEY).then((blds: BuildingMap) => {
      this.buildings = blds;
      this.loaded = true;
    }, reason => {
      console.log(reason);
    });

    let floors: FloorMap;

    await loadData('floors', FLOORS_STORAGE_KEY).then(
      (f: FloorMap) => {
        floors = f;
    });

    Object.values(this.buildings).forEach((b: Building) => {
      b.floors = Object.values(floors || {}).reduce((ob: FloorMap, f: Floor) => {
        if (f.buildingId === b.id) ob[f.id] = f;
        return ob;
      }, {} as Floor);
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
              <rl-card
                class="rl-card--building mdc-layout-grid__cell mdc-layout-grid__cell--span-4-desktop"
                titleInMedia={true}
                cardTitle={building.name}
                cardMedia={building.image}
                mediaSize="cover"
                buttons={[
                  { name: 'Map It!', link: `${BASE_URL}${ROUTES.DIRECTORY}/${building.code}` },
                ]}
                >
                <div slot="primary">
                  <rl-expansion-panel index={1}>
                    <div slot="header">{building.description}</div>
                    <div slot="content">
                      {Object.keys(building.floors).map(id => {
                        const floor = building.floors[id];
                        return (
                        <rl-expansion-panel index={floor.id}>
                          <div slot="header">{floor.name}</div>
                          <div slot="content">
                            <div>{floor.description}</div>
                          </div>
                        </rl-expansion-panel>
                        );
                      })}
                    </div>
                  </rl-expansion-panel>
                </div>
              </rl-card>
            )}
          </div>
        </div>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
