import { Coordinate, sum } from './coordinate';

/**
 * Moves a single `Coordinate` but a specified distance.
 * @param c A `Coordinate` to move.
 * @param delta The distance to move by.
 */
export function movePoint(c: Coordinate, delta: Coordinate): Coordinate {
  return sum(c, delta).round();
}

/**
 * Moves a given `Coordinate` or `Coordinate`s by a specified distance in the
 * x and y axes.
 * @param c A `Coordinate` or `Coordinate`s to move.
 * @param delta The distance to move by.
 */
export function movePoints(c: Coordinate[], delta: Coordinate): Coordinate[] {
  return c.map(i => movePoint(i, delta));
}

/**
 * Replaces an item in a given array with a new one.
 *
 * @param array The array to replace the item in.
 * @param index The index of the item to replace.
 * @param item The new item to place at `index`.
 */
export function arrayReplace(array: any[], index: number, item: any) {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

/**
 * Creates a new Coordinate based on the clientX/Y values of a given event or the
 * top-left corner of an element.  Optionally gets the position relative to a
 * second element.
 *
 * @param e The event to retrieve the client coordinates from.
 */
export function coordinateFromEvent(a: any, b?: any) {
  const ap = getClientPosition(a);
  const bp = getClientPosition(b);
  return new Coordinate(ap.x - bp.x, ap.y - bp.y);
}

/**
 * Returns the position of the event or the element's border box relative to
 * the client viewport. If an event is passed, and if this event is a "touch"
 * event, then the position of the first changedTouches will be returned.
 *
 * @param el Element or a mouse / touch event.
 * @return The position.
 */
function getClientPosition(el: any): Coordinate {
  if (el.nodeType === 1 /* NodeType ELEMENT */) {
    return getClientPositionForElement_(el);
  } else {
    const targetEvent = el.changedTouches ? el.changedTouches[0] : el;
    return new Coordinate(targetEvent.clientX, targetEvent.clientY);
  }
}

/**
 * Returns the position of the event or the element's border box relative to
 * the client viewport.
 *
 * @param el Element whose position to get.
 * @return The position.
 */
function getClientPositionForElement_(el: Element): Coordinate {
  const box = getBoundingClientRect_(el);
  return new Coordinate(box.left, box.top);
}

/**
 * Gets the client rectangle of the DOM element.
 *
 * getBoundingClientRect is part of a new CSS object model draft (with a
 * long-time presence in IE), replacing the error-prone parent offset
 * computation and the now-deprecated Gecko getBoxObjectFor.
 *
 * This utility patches common browser bugs in getBoundingClientRect. It
 * will fail if getBoundingClientRect is unsupported.
 *
 * If the element is not in the DOM, the result is undefined, and an error may
 * be thrown depending on user agent.
 *
 * @param el The element whose bounding rectangle is being queried.
 * @return A native bounding rectangle with numerical left, top,
 *     right, and bottom.  Reported by Firefox to be of object type ClientRect.
 */
function getBoundingClientRect_(el: Element) {
  let rect;
  try {
    rect = el.getBoundingClientRect();
  } catch (e) {
    // In IE < 9, calling getBoundingClientRect on an orphan element raises an
    // "Unspecified Error". All other browsers return zeros.
    return { 'left': 0, 'top': 0, 'right': 0, 'bottom': 0 };
  }

  return rect;
}
