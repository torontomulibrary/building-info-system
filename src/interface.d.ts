/**
 * Base type for any object that has a name and description.  Also includes
 * alt-text for an additional accessibility-oriented description.
 */
export type DescribedObject = {
  /**
   * Additional text describing the object in a way that is appropriate for
   * accessibility purposes.
   */
  altText: string;

  /**
   * A description of the object.
   */
  description: string;

  /**
   * An identifier for the object.
   */
  id: number;

  /**
   * The name of the object.
   */
  name: string;
}

export type NumberMap<T> = { [keys: number]: T }

export interface Faq {
  question?: string;
  answer?: string;
}
export interface FaqMap extends NumberMap<Faq> {}

export interface CalEvent {
  group: string,
  location: string,
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
}

export interface Floor extends DescribedObject {
  buildingId: number;
  floorplan: string;
  floorplanImg: string;
  number: number;
  weight: number;
  image: string;
  function: string;
  icon: string;
  elements: MapElementMap;
  enabled: boolean;
}

export interface Building extends DescribedObject {
  code: string;
  shortName: string;
  floors: FloorMap;
  image: string;
  enabled: boolean;
}

export interface MapElement extends DescribedObject {
  details: MapElementDetailMap;
  floorId: number;
  icons: string[];
  points: string;
  enabled: boolean;
}

export interface MapElementDetail extends DescribedObject {
  elementId: number;
  detailTypeId: number;
  code: string;
  callStart: string;
  callEnd: string;
  type: MapElementDetailType;
}

export interface MapElementDetailType extends DescribedObject {
  category: number;
  icon: string;
  cataloguePattern: string;
  priority: string;
}

export interface BuildingMap extends NumberMap<Building> {}
export interface FloorMap extends NumberMap<Floor> {}
export interface MapElementMap extends NumberMap<MapElement> {}
export interface MapElementDetailMap extends NumberMap<MapElementDetail> {}
export interface MapElementDetailTypeMap extends NumberMap<MapElementDetailType> {}

export interface MapData {
  buildings: BuildingMap,
  floors: FloorMap,
  elements: MapElementMap,
  details: MapElementDetailMap,
}

export interface SearchHistory {
  popular: Array<{
    count: number,
    id: number,
    lastUsed: string,
    value: string
  }>,
  recent: Array<{
    count: number,
    id: number,
    lastUsed: string,
    value: string
  }>,
}

export interface AppData {
  // apiUrl: string,
  // baseUrl: string,
  bookDetails?: BookDetails,
  buildings: BuildingMap,
  details: MapElementDetailMap,
  elements: MapElementMap,
  events: CalEvent[],
  // eventUrl: string,
  faqs: FaqMap,
  floors: FloorMap,
  searches?: SearchHistory,
  // searchUrl: string,
}

export interface BookDetails {
  author: string,
  availability: string[],
  callNo: string,
  isOnline: string,
  locations: string[],
  title: string,
}

export * from './components';
// export * from './components/map/map-interface';
export * from './components/search-box/search-box-interface';
