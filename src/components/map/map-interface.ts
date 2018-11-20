import { DescribedObject, NumberMap } from '../../interface';
import { Coordinate } from '../../utils/coordinate';

export interface MapElementDetailType extends DescribedObject {
  category: number;
  icon: string;
  iconImg: string;
  cataloguePattern: string;
  priority: string;
}

export interface MapElementDetailTypeMap extends NumberMap<MapElementDetailType> {}

export interface MapElementDetail extends DescribedObject {
  elementId: number;
  detailTypeId: number;
  code: string;
  callStart: string;
  callEnd: string;
  type: MapElementDetailType;
}

export interface MapElementDetailMap extends NumberMap<MapElementDetail> {}

export interface MapElement extends DescribedObject {
  details: MapElementDetailMap;
  floorId: number;
  iconPath: string[];
  iconSrc: string[];
  points: string;
}

export interface MapElementMap extends NumberMap<MapElement> {}

export interface ParsedMapElement {
  coordinates: Coordinate[];
  icons?: HTMLImageElement[];
  iconSrc: string[];
  id: number;
  name: string;
  path: string;
}
