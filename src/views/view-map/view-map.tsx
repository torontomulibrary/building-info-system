import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  State,
} from '@stencil/core';
import { MatchResults } from '@stencil/router';

import {
  AppData,
  BookDetails,
  Building,
  BuildingMap,
  Floor,
  FloorMap,
  MapElement,
  MapElementDetail,
  MapElementDetailMap,
  MapElementMap,
} from '../../interface';

import { fetchIMG, fetchJSON } from '../../utils/fetch';
import { compareLCCN } from '../../utils/lccn';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  /**
   * Any URL matches for determining pre-selected building, floor and element.
   */
  private paramMatches: RegExpExecArray | null | undefined;

  private initialBuilding = -1;

  private initialFloor = -1;

  private initialElement?: number;

  /**
   * Root element of this component.
   */
  @Element() root!: HTMLStencilElement;

  @State() loaded = false;

  /**
   * A string matched from the URL that should be used to pre-select a specific
   * building, building and floor, or building, floor and element.
   */
  @State() query = '';

  /**
   * The global object of all application data.
   */
  @Prop({ mutable: true }) appData!: AppData;

  /**
   * A global flag passed in to indicate if the application has loaded as well.
   */
  @Prop() appLoaded = false;

  @Prop() mapType = 'directory';

  /**
   * The results coming from `stencil-router` that contain any URL matches.
   */
  @Prop() match!: MatchResults;

  /**
   * Event fired when the data specific to this view is finished loading.
   */
  @Event() dataLoaded!: EventEmitter;

  async componentWillLoad() {
    // Check the URL value to see if any Building, Floor and or Location was
    // provided.  Must be in the form BLD[FLR][RM].
    // Where BLD is the three letter building code, FLR is the floor number,
    // and RM is the 'room number'.  The `room number` is actually the full
    // location code (e.g. SLC508)
    if (this.match && this.match.params) {
      if (this.match.params.roomNo) {
        const query = this.match.params.roomNo;
        const re = /([A-Z]{3})(\d{2}(?=.{2,}|$)|\d{1})?.*/;
        this.paramMatches = re.exec(query);
      } else {
        this.paramMatches = undefined;
      }

      if (this.match.params.callNo) {
        const query = this.match.params.callNo;
        if (query.charAt(0) === 'b') {
          // Have a book record number.
          await fetchJSON(this.appData.apiUrl + 'books/' + query).then((d: BookDetails) => {
            this.appData = { ...this.appData, bookDetails: d };
          });
        } else {
          // Invalid record number.
        }
      }
    }

    // Load buildings.
    await fetchJSON(this.appData.apiUrl + 'buildings').then(
        (b: BuildingMap) => {
      this.appData = { ...this.appData, buildings: b };
    });

    // Load floors.
    await fetchJSON(this.appData.apiUrl + 'floors').then(
        (f: FloorMap) => {
      this.appData = { ...this.appData, floors: f };
    });

    // Load elements.
    await fetchJSON(this.appData.apiUrl + 'elements').then(
        (e: MapElementMap) => {
      this.appData = { ...this.appData, elements: e };
    });

    // Load details.
    await fetchJSON(this.appData.apiUrl + 'details').then(
        (d: MapElementDetailMap) => {
      this.appData = { ...this.appData, details: d };
    });

    const { buildings, floors, elements, details, bookDetails } = this.appData;

    Object.values(buildings).forEach((b: Building) => {
      b.enabled = (this.mapType === 'directory' ||
          (this.mapType !== 'directory' && b.code === 'LIB')) ?
          true : false;
      b.floors = Object.values(floors || {}).reduce((ob: FloorMap, f: Floor) => {
        if (f.buildingId === b.id) ob[f.id] = f;
        return ob;
      }, {} as Floor);

      // Set the initial building to the first or the one specified in the URL.
      if (b.enabled && (this.initialBuilding === -1) ||
          (this.paramMatches && this.paramMatches[1] && b.code === this.paramMatches[1])) {
        this.initialBuilding = b.id;
      }
    });

    Object.values(floors).forEach((f: Floor) => {
      f.enabled = (this.mapType === 'directory' ||
          (this.mapType === 'book' && bookDetails &&
          bookDetails.locations.indexOf(f.name) !== -1)) ?
          true : false;
      f.elements = Object.values(elements || {}).reduce((ob, e) => {
        if (e.floorId === f.id) ob[e.id] = e;
        return ob;
      }, {} as MapElement);

      // Set the initial floor to the specified floor, or first floor of the
      // initial building.
      if (f.enabled && (f.buildingId === this.initialBuilding && this.initialFloor === -1) ||
          (this.paramMatches && this.paramMatches[2] && f.number === Number(this.paramMatches[2]))) {
        this.initialFloor = f.id;
      }
    });

    // Load floorplan images, starting with the image for the initial floor.
    fetchIMG(floors[this.initialFloor].floorplan);

    Object.values(floors).forEach((f: Floor) => {
      if (f.floorplan && f.id !== this.initialFloor) {
        fetchIMG(f.floorplan);
      }
    });

    Object.values(elements).forEach((e: MapElement) => {
      e.details = Object.values(details || {}).reduce((ob, d) => {
        if (d.elementId === e.id) ob[d.id] = d;
        return ob;
      }, {} as MapElementDetail);

      e.enabled = (this.mapType === 'directory' ||
          (this.mapType === 'book' && bookDetails &&
          this.bookOnShelf(bookDetails.callNo, e))) ?
          true : false;

      if (e.enabled && this.mapType === 'book' && !this.initialElement) {
        this.initialElement = e.id;
      }

      if (e.icons && e.icons.length) {
        e.icons.forEach((path: string) => {
          fetchIMG(path);
        });
      }
    });

    this.loaded = true;
    this.dataLoaded.emit(this.appData);
  }

  bookOnShelf(callNo: string, shelf: MapElement) {
    let found = false;
    if (shelf.details) {
      Object.values(shelf.details).forEach((d: MapElementDetail) => {
        const startCompare = compareLCCN(d.callStart, callNo);
        const endCompare = compareLCCN(callNo, d.callEnd);
        if (startCompare && startCompare >= 0 && endCompare && endCompare >= 0) {
          found = true;
        }
      });
    }

    return found;
  }

  hostData() {
    return {
      class: {
        'rula-view': true,
        'rula-view--map': true,
        'rula-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    if (this.loaded) {
      return ([
        <stencil-route-title pageTitle="Directory" />,
        <rula-map-container
            buildings={this.appData.buildings}
            initialBuilding={this.initialBuilding}
            initialFloor={this.initialFloor}
            initialElement={this.initialElement}
            extraDetails={this.appData.bookDetails}>
        </rula-map-container>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
