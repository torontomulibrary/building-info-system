export * from './components';
export * from './components/map/map-interface';

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

interface Faq {
  question?: string;
  answer?: string;
}
interface FaqMap extends NumberMap<Faq> {}

interface CalEvent {
  group: string,
  location: string,
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
}

interface Floor extends DescribedObject {
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

interface Building extends DescribedObject {
  code: string;
  shortName: string;
  floors: FloorMap;
  image: string;
  enabled: boolean;
}

interface MapElement extends DescribedObject {
  details: MapElementDetailMap;
  floorId: number;
  iconPath: string[];
  iconSrc: string[];
  points: string;
}

interface MapElementDetail extends DescribedObject {
  elementId: number;
  detailTypeId: number;
  code: string;
  callStart: string;
  callEnd: string;
  type: MapElementDetailType;
}

interface MapElementDetailType extends DescribedObject {
  category: number;
  icon: string;
  iconImg: string;
  cataloguePattern: string;
  priority: string;
}

interface BuildingMap { [keys: number]: Building }
interface FloorMap { [keys: number]: Floor }
interface MapElementMap { [keys: number]: MapElement }
interface MapElementDetailMap { [keys: number]: MapElementDetail }
interface MapElementDetailTypeMap { [keys: number]: MapElementDetailType }

interface MapData {
  buildings?: BuildingMap,
}

interface SearchHistory {
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

interface AppData {
  buildings?: BuildingMap,
  details?: MapElementDetailMap,
  elements?: MapElementMap,
  events?: CalEvent[],
  faqs?: FaqMap,
  floors?: FloorMap,
  searches?: SearchHistory,
  bookDetails?: BookDetails,
  apiUrl: string,
  searchUrl: string,
  icalUrl: string,
}

interface BookDetails {
  availability: string[],
  locations: string[],
  callNo: string,
  title: string,
  author: string,
  isOnline: string,
}

export {
  AppData,
  BookDetails,
  Building,
  BuildingMap,
  CalEvent,
  Faq,
  FaqMap,
  Floor,
  FloorMap,
  MapData,
  MapElement,
  MapElementMap,
  MapElementDetail,
  MapElementDetailMap,
  MapElementDetailType,
  MapElementDetailTypeMap,
  SearchHistory,
}

export * from './components/search-box/search-box-interface';
