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
  id: number;
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
  code: string;
  building: string;
  floorplan: string;
  floorplanImg: string;
  number: number;
  weight: number;
  image: string;
  function: string;
  icon: string;
  // elements: MapElementData[];
  details: MapElement[];
  enabled: boolean;
  hasComputers: boolean;
}

export interface Building extends DescribedObject {
  code: string;
  shortName: string;
  floors: FloorMap;
  image: string;
  enabled: boolean;
}

// export interface MapElementData extends DescribedObject {
//   details: MapElementDetail[];
//   clickable?: boolean;
//   floor: string;
//   icon?: string | null;
//   points: string;
//   enabled: boolean;
//   category: number;
//   alt?: boolean;
//   symbol?: string;
// }

export interface MapElement extends DescribedObject {
  elementId: number;
  detailTypeId: number;
  floor: string;
  code: string;
  callStart: string;
  callEnd: string;
  category: string;
  categoryName: string;
  type: MapElementType;
}

export interface MapElementType extends DescribedObject {
  category: number;
  icon: string;
  cataloguePattern: string;
  priority: string;
}

// export interface DetailType extends DescribedObject {
//   category: number;
//   cataloguePattern?: string;
//   iconPath?: string;
//   priority?: number;
// }

export interface ComputerAvailability {
  name: string,
  available: boolean,
}

export interface ComputerLab {
  // elementId: number;
  // floor?: string,
  // description?: string,
  // altText?: string,
  computerAvailable: number,
  computerTotal: number,
  code: string,
  computers?: ComputerAvailability[],
}

export interface BuildingMap extends NumberMap<Building> {}
export interface FloorMap extends NumberMap<Floor> {}
// export interface MapElementDataMap extends NumberMap<MapElementData> {}
export interface MapElementMap extends NumberMap<MapElement> {}
export interface MapElementTypeMap extends NumberMap<MapElementType> {}
export interface ComputerLabMap extends NumberMap<ComputerLab> {}
// export interface DetailTypeMap extends NumberMap<DetailType> {}

export interface MapData {
  buildings: BuildingMap,
  floors: FloorMap,
  // elements: MapElementDataMap,
  details: MapElementMap,
}

export interface SearchHistory {
  popular: Array<{
    count: number,
    id: number,
    image: string,
    lastUsed: string,
    value: string
  }>,
  recent: Array<{
    count: number,
    id: number,
    image: string,
    lastUsed: string,
    value: string,
  }>,
}

export interface AppData {
  // apiUrl: string,
  // baseUrl: string,
  bookDetails?: BookDetails,
  buildings: BuildingMap,
  // details: MapElementDetailMap,
  elements: MapElementMap,
  events: CalEvent[],
  // eventUrl: string,
  faqs: FaqMap,
  floors: FloorMap,
  searches?: SearchHistory,
  // searchUrl: string,
}

export interface BookAvailability {
  statusMessage: string,
  location: string,
  callNumber: string,
  shelf: string,
}

export interface BookDetails {
  author: string[],
  availability: BookAvailability[],
  iSBN: string[],
  mapLink: string,
  publicationYear: string,
  thumbnail_m: string,
  title: string,
}

export type SearchResultType = 'question_answer' | 'event' | 'location_on' | 'book';

export interface SearchResultItem {
  id: string,
  value: string,
  type: SearchResultType,
  detail?: string,
}

export type ClusterDataType = 'card' | 'list';

/**
 * Data for a single item within a cluster component.
 */
export interface ClusterData {
  /** The type of data. */
  type: ClusterDataType;
  title: string;
  subTitle: string;
  link: string;
  media?: string;
  icon?: string;
}

export * from './components';
// export * from './components/map/map-interface';
export * from './components/search-box/search-box-interface';
