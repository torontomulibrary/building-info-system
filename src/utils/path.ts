import { Coordinate } from './coordinate';

/**
 * Parses a string of x/y coordinate pairs separated by spaces.  If there is
 * only one pair, returns an object with the parameters `x` and `y` set
 * respectively.  Otherwise, returns an SVG Path string of the form
 * "M x1 y1 L x2 y2 ... L xN yN Z".
 *
 * @param data A string of space-separated coordinates.
 */
export function decodeCoordinates(data: string, closed: boolean) {
 const pointData = data.split(' ');
 const points: Coordinate[] = [];
 let i = pointData.length - 2;
 let x;
 let y;

 // Closed paths end with 'Z'. Start with that and work backwards unless open.
 let path = closed ? 'Z' : '';

 while (i >= 0) {
   x = Math.round(Number(pointData[i]));
   y = Math.round(Number(pointData[i + 1]));
   points.push(new Coordinate(x, y));
   path = (i === 0 ? ['M', x, y, path].join(' ') : ['L', x, y, path].join(' '));
   i -= 2;
 }

 return { path, points };
}

/**
 * Turns an array of Coordinate objects into a single space-separated string.
 * @param points An array of Coordinates.
 */
export function encodeCoordinates(points: Coordinate[]) {
  return points.map(i => {
    return i.toPathString();
  }).join(' ');
}

export function pathFromPoints(points: Coordinate[], open = false): string {
  return points.map((i, idx) => {
    if (idx === 0) {
      return 'M ' + i.toPathString();
    } else if (idx === points.length - 1 && !open) {
      return ' L ' + i.toPathString() + ' Z';
    } else {
      return ' L ' + i.toPathString();
    }
  }).join();
}
