import { Store, Action } from '@stencil/redux';

interface LazyStore {
  addReducers: (any) => any;
  subscribe: (callback: Function) => Function;
  dispatch: (detail: object) => void;
  getState: () => any;
}

interface Faq {
  question: string;
  answer: string;
}
interface FaqMap { [keys: number]: Faq }

// Base type for objects that have name/description/altText
interface DescribedObject {
  id: number;
  name: string;
  description: string;
  altText: string;
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
}

interface Building extends DescribedObject {
  code: string;
  shortName: string;
  floors: FloorMap;
}

interface MapElement {
  id: number;
  floorId: number;
  coordinates: string;
  details: MapElementDetailMap;
  icon: string;
  iconImg: string;
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

export {
  Building,
  BuildingMap,
  LazyStore,
  Faq,
  FaqMap,
  Floor,
  FloorMap,
  MapElement,
  MapElementMap,
  MapElementDetail,
  MapElementDetailMap,
  MapElementDetailType,
  MapElementDetailTypeMap,
}

export * from './components/search-box/search-box-interface';