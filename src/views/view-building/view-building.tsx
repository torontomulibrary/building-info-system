import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { RouterHistory } from '@stencil/router';

import { BASE_URL } from '../../global/config';
import {
  APP_DATA,
  MAP_TYPE,
  ROUTES,
} from '../../global/constants';
import { Building, BuildingMap, Floor, FloorMap } from '../../interface';
import { dataService } from '../../utils/data-service';

@Component({
  tag: 'view-building',
  styleUrl: 'view-building.scss',
})

export class ViewBuilding {
  @Element() root!: HTMLElement;

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
   * Reference to the stencil-router history object. Used to programmatically
   * change the browser history when the selected FAQ changes.
   */
  @Prop() history!: RouterHistory;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  /**
   * Lifecycle event fired when the component is first initialized and not
   * yet in the DOM.
   */
  async componentWillLoad() {
    this.buildings = dataService.getData(APP_DATA.BUILDING);
    const floors: FloorMap = dataService.getData(APP_DATA.FLOORS);

    Object.values(this.buildings).forEach((b: Building) => {
      b.floors = Object.values(floors || {}).reduce((ob: FloorMap, f: Floor) => {
        if (f.buildingId === b.id) ob[f.id] = f;
        return ob;
      }, {} as Floor);
    });
  }

  componentDidLoad() {
    this.checkSize();
  }

  checkSize() {
    if (this.root.offsetHeight === 0) {
      this.queue.write(() => {
        this.checkSize();
      });
    } else {
      this.loaded = true;
    }
  }

  /**
   * Component render function.
   */
  render() {
    if (this.buildings) {

      return (
        <Host class={{
          'rl-view': true,
          'rl-view--buildings': true,
          'rl-view--loaded': this.loaded && this.appLoaded,
        }}>
          <stencil-route-title pageTitle="Buildings | " />
          <h2 class="rl-view__heading">Building Information</h2>
          <div class="rl-view__container mdc-layout-grid">
            <div class="mdc-layout-grid__inner">
              {Object.values(this.buildings).map((building: Building) =>
                <rl-card
                  class="rl-card--building mdc-layout-grid__cell mdc-layout-grid__cell--span-4-desktop"
                  titleInMedia={true}
                  cardTitle={building.name}
                  cardMedia={building.image}
                  mediaSize="cover"
                  hasPrimaryAction={true}
                  buttons={[
                    { name: 'Map It!', link: `${BASE_URL}${ROUTES.MAP}/${MAP_TYPE.LOCN}/${building.code}` },
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
          </div>
        </Host>
      );
    }

    return (
      <Host class={{
        'rl-view': true,
        'rl-view--buildings': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      }}>
        <stencil-route-title pageTitle="Buildings | " />
        <div>Loading...</div>
      </Host>
    );
  }
}
