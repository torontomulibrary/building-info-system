import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  State,
} from '@stencil/core';
import { MatchResults } from '@stencil/router';

import { API_URL } from '../../global/config';
import {
  BUILDINGS_STORAGE_KEY,
  DETAILS_STORAGE_KEY,
  ELEMENTS_STORAGE_KEY,
  FLOORS_STORAGE_KEY,
} from '../../global/constants';
import {
  // AppData,
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
import { loadData } from '../../utils/load-data';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  private _blds!: BuildingMap;
  private _flrs!: FloorMap;
  private _elms!: MapElementMap;
  private _dtls!: MapElementDetailMap;
  private _book!: BookDetails;

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

  @State() buildings?: BuildingMap;

  /**
   * The global object of all application data.
   */
  // @Prop({ mutable: true }) appData!: AppData;

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
          await fetchJSON(API_URL + 'books/' + query).then((d: BookDetails) => {
            this._book = d;
          });
          await loadData('books/' + query).then(
            (b: BookDetails) => {
              this._book = b;
          });
        } else {
          // Invalid record number.
        }
      }
    }

    // Load buildings.
    await loadData('buildings', BUILDINGS_STORAGE_KEY).then(
      (b: BuildingMap) => {
        this._blds = b;
    });

    await loadData('floors', FLOORS_STORAGE_KEY).then(
      (f: FloorMap) => {
        this._flrs = f;
    });

    await loadData('elements', ELEMENTS_STORAGE_KEY).then(
      (e: MapElementMap) => {
        this._elms = e;
    });

    await loadData('details', DETAILS_STORAGE_KEY).then(
      (d: MapElementDetailMap) => {
        this._dtls = d;
    });

    Object.values(this._blds).forEach((b: Building) => {
      b.enabled = (this.mapType === 'directory' ||
          (this.mapType !== 'directory' && b.code === 'LIB')) ?
          true : false;
      b.floors = Object.values(this._flrs || {}).reduce((ob: FloorMap, f: Floor) => {
        if (f.buildingId === b.id) ob[f.id] = f;
        return ob;
      }, {} as Floor);

      // Set the initial building to the first or the one specified in the URL.
      if (b.enabled && (this.initialBuilding === -1) ||
          (this.paramMatches && this.paramMatches[1] && b.code === this.paramMatches[1])) {
        this.initialBuilding = b.id;
      }
    });

    Object.values(this._flrs).forEach((f: Floor) => {
      f.enabled = (this.mapType === 'directory' ||
          (this.mapType === 'book' && this._book &&
          this._book.locations.indexOf(f.name) !== -1)) ?
          true : false;
      f.elements = Object.values(this._elms || {}).reduce((ob, e) => {
        if (e.floorId === f.id) ob[e.id] = e;
        return ob;
      }, {} as MapElement);

      // Set the initial floor to the specified floor, or first floor of the
      // initial building.
      if (f.enabled && f.buildingId === this.initialBuilding && (this.initialFloor === -1 ||
          this.paramMatches && this.paramMatches[2] && f.number === Number(this.paramMatches[2]))) {
        this.initialFloor = f.id;
      }
    });

    // Load floorplan images, starting with the image for the initial floor.
    fetchIMG(this._flrs[this.initialFloor].floorplan);

    Object.values(this._flrs).forEach((f: Floor) => {
      if (f.floorplan && f.id !== this.initialFloor) {
        fetchIMG(f.floorplan);
      }
    });

    Object.values(this._elms).forEach((e: MapElement) => {
      e.details = Object.values(this._dtls || {}).reduce((ob, d: MapElementDetail) => {
        if (this.paramMatches && d.code === this.paramMatches[0] &&
            this.mapType === 'directory' && !this.initialElement) {
          this.initialElement = d.elementId;
        }
        if (d.elementId === e.id) ob[d.id] = d;
        return ob;
      }, {} as MapElementDetail);

      e.enabled = (this.mapType === 'directory' ||
          (this.mapType === 'book' && this._book &&
          this.bookOnShelf(this._book.callNo, e))) ?
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
    this.buildings = this._blds;
    // this.dataLoaded.emit(this.appData);
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
        'rl-view': true,
        'rl-view--map': true,
        'rl-view--loaded': this.loaded && this.appLoaded,
      },
    };
  }

  render() {
    if (this.loaded && this.buildings) {
      return ([
        <stencil-route-title pageTitle="Directory" />,
        <rl-map-container
            buildings={this.buildings}
            initialBuilding={this.initialBuilding}
            initialFloor={this.initialFloor}
            initialElement={this.initialElement}
            extraDetails={this._book}>
        </rl-map-container>,
      ]);
    }

    return (<div>Loading...</div>);
  }
}
