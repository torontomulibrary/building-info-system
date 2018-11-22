import { Coordinate } from '../../utils/coordinate';

export interface ParsedMapElement {
  coordinates: Coordinate[];
  enabled: boolean;
  icons?: string[];
  iconImages?: HTMLImageElement[];
  id: number;
  name: string;
  path: string;
}
