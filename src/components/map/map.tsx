import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { CONTROL_SIZE, DEFAULT_MAX_SCALE, DEFAULT_MIN_SCALE, HYSTERESIS, STATES } from '../../global/constants';
import { Coordinate, difference, squareDistance, sum } from '../../utils/coordinate';
import { coordinateFromEvent } from '../../utils/helpers';
import { decodeCoordinates } from '../../utils/path';

import { MapElementMap, ParsedMapElement } from '../../interface';

@Component({
  tag: 'rula-map',
  styleUrl: 'map.scss',
})

export class RulaMap {
  // The array of MapElements currently being displayed.  Created from the
  // `elements` Prop with additional internal information added.
  private processedElements: ParsedMapElement[] = [];

  // The element being targeted by user interaction.
  private targetElement: ParsedMapElement | undefined;

  // The full size of the image being displayed by the map.
  private _imgSize: DOMRect | undefined;

  // The original scale factor used to size the SVG so it fits.
  private _initialScale = 1;

  // The position of the most recent user interaction (mouse/touch-move).
  private _last!: Coordinate;

  // The bounds used to restrict how far the SVG can be dragged.
  private _limits!: DOMRect;

  // Timer reference used to debounce multiple resize events.
  private _resizeDebounce: any;

  // The initial position of a user interaction (mousedown/touchstart).
  private _start!: Coordinate;

  // The current state of the Map.
  private _state = STATES.NORMAL;

  // The current size of the SVG element used to display the map.
  private _svgSize!: ClientRect | DOMRect | undefined;

  // Reference to the root node (`rula-map`).
  @Element() root!: HTMLElement;

  /**
   * The currently active element.
   */
  @State() activeElement: ParsedMapElement | undefined;

  /**
   * The factor by which the Map contents are changed to fit within the SVG.
   */
  @State() _svgScale = 1;

  @State() floorplanImage!: SVGImageElement;

  /**
   * The x,y translation applied to move the map contents within the bounds of
   * the SVG.
   */
  @State() _svgTransform = new Coordinate(0, 0);

  /**
   *  The maximum scale factor.
   */
  @Prop() maxScale: number = DEFAULT_MAX_SCALE;

  /**
   * The minimum scale factor.
   */
  @Prop() minScale: number = DEFAULT_MIN_SCALE;

  /**
   * An array of the elements that will be displayed on the Map.
   */
  @Prop({ mutable: true }) elements!: MapElementMap;

  /**
   * An image that will be displayed on the Map.
   */
  @Prop() floorplan?: string;
  @Watch('floorplan')
   /**
    * Handles when the floorplan Image is loaded/updated.
    */
  onFloorplanChange() {
    if (!this.floorplan) {
      return;
    }

    const img = new Image();
    img.src = this.floorplan;
    img.onload = () => {
      if (this._imgSize &&
        this._imgSize.width === img.width &&
        this._imgSize.height === img.height) {
          return;
      }

      this._imgSize = new DOMRect(0, 0, img.width, img.height);
      this._computeSvgSize();
      this._computeScale();
      this._computeLimits();
    };
  }

  /**
   * An event fired when the user selects a MapElement. The clicked element
   * will be passed as the event parameter.
   */
  @Event() elementSelected!: EventEmitter;

  /**
   * An event fired when the user deselects the selected MapElement. The clicked
   * element will be passed as the event parameter.
   */
  @Event() elementDeselected!: EventEmitter;

  /**
   * An event fired when the map floorplan is updated.
   */
  @Event() mapRendered!: EventEmitter;

  /**
   * Handle when the list of specified elements changes.
   */
  @Watch('elements')
  elementsChanged() {
    const elements = this.elements;
    this.processedElements = Object.keys(elements).map(i => {
      const el = elements[Number(i)];
      const decoded = decodeCoordinates(el.points, true);
      let parsed = {};

      if (el.iconSrc.length) {
        const icons: HTMLImageElement[] = [];
        el.iconSrc.forEach(src => {
          const icon = new Image();
          icon.src = src;
          icons.push(icon);
        });
        parsed = { icons };
      }

      return ({
        ...parsed,
        coordinates: decoded.points,
        iconSrc: el.iconSrc,
        id: el.id,
        name: el.name,
        path: decoded.path,
        // size: CONTROL_SIZE,
      }) as ParsedMapElement;
    });
  }

  componentDidLoad() {
    this.onFloorplanChange();
  }

  componentDidUpdate() {
    this.mapRendered.emit();
  }

  /**
   * Handles when the user triggers a touch/down event to start interaction with
   * the map.
   * @param e The triggering event.
   */
  @Listen('mousedown')
  @Listen('touchstart')
  onGestureDown(e: Event) {
    this._start = this._last = coordinateFromEvent(e, this.root);
    if (this._state === STATES.NORMAL) {
      this._state = STATES.GESTURE_DOWN;
    }

    // Determine if the position was inside an element.
    let target = e.target;
    if (target && target instanceof HTMLImageElement || target instanceof SVGRectElement) {
      target = target.parentElement;
    }

    // At this point, target should be either the MapElement path or the
    // MapPoint group, both that have the ID.
    if (target && target instanceof SVGPathElement || target instanceof SVGGElement) {
      const id = Number(target.id);
      this.targetElement = this.processedElements.find(i => i.id === id);
    }
  }

  /**
   * Handles when the user triggers a movement event.
   * @param e The triggering event.
   */
  @Listen('mousemove')
  @Listen('touchmove')
  onGestureMove(e: Event) {
    if (this._state === STATES.NORMAL) {
      return;
    }

    // Convert the coordinate to SVG coordinate space.
    const point = coordinateFromEvent(e, this.root);

    switch (this._state) {
      case STATES.GESTURE_DOWN:
        const dist = squareDistance(this._start, point);
        if (dist > HYSTERESIS) {
          this._state = STATES.DRAGGING;
        }
        break;
      case STATES.DRAGGING:
        const delta = difference(point, this._last);
        this._svgTransform = sum(this._svgTransform, delta).limit(this._limits).round();
        break;
      default:
    }

    this._last = point;
  }

  /**
   * Handles when the user ends their interaction with the Map.
   * @param e The triggering event.
   */
  @Listen('mouseup')
  @Listen('touchend')
  onMouseUp(e: Event) {
    const point = coordinateFromEvent(e, this.root);

    if (this._state === STATES.DRAGGING) {
      const delta = difference(point, this._last);
      this._svgTransform = sum(this._svgTransform, delta).limit(this._limits).round();
      this._state = STATES.NORMAL;
    } else if (this._state === STATES.GESTURE_DOWN) {
      if (this.targetElement) {
        if (this.targetElement !== this.activeElement) {
          this._setActiveElement(this.targetElement);
          this.targetElement = undefined;
        }
      } else {
        this.elementDeselected.emit(this.activeElement);
        this._clearActiveElement();
      }
      this._state = STATES.NORMAL;
    }
  }

  /**
   * Handles when the user leaves the bounds of the Map entirely.
   * @param e The triggering event.
   */
  @Listen('mouseleave')
  onMouseLeave(e: Event) {
    if (this._state === STATES.DRAGGING ||
        this._state === STATES.GESTURE_DOWN) {
      this._state = STATES.NORMAL;
      const point = coordinateFromEvent(e, this.root);

      if (this._state === STATES.DRAGGING) {
        const delta = difference(point, this._last);
        this._svgTransform = sum(this._svgTransform, delta).limit(this._limits).round();
        this._state = STATES.NORMAL;
      }
    }
  }

  /**
   * Handles when the user performs a resize action.
   */
  @Listen('window:resize')
  onResize() {
    clearTimeout(this._resizeDebounce);
    this._resizeDebounce = setTimeout(_ => {
      // Use a 150ms delay to debounce multiple resize calls and effectively
      // perform the resize action only when the user is 'done' resizing.
      this._computeSvgSize();
      this._computeScale();
      this._computeLimits();
      this._svgTransform = this._svgTransform.clone().limit(this._limits);
    }, 150);
  }

  /**
   * Handles when the user performs a mouse wheen event.  The Map will be zoomed
   * in or out depending on the direction of the wheel.
   *
   * @param e The triggering event.
   */
  @Listen('wheel')
  onWheel(e: MouseWheelEvent) {
    const oldPos = this._toSvgSpace(new Coordinate(e.clientX, e.clientY));

    if (e.deltaY < 0) {
      if (this._svgScale * 1.05263157895 < this._initialScale * this.maxScale) {
        this._svgScale *= 1.05263157895;
      }
    } else {
      if (this._svgScale * 0.95 > this._initialScale * this.minScale) {
        this._svgScale *= 0.95;
      }
    }

    this._computeLimits();
    const newPos = this._toSvgSpace(new Coordinate(e.clientX, e.clientY));
    const delta = difference(newPos, oldPos).scale(this._svgScale);
    this._svgTransform.translate(delta).limit(this._limits).round();
  }

  @Listen('keydown.enter')
  onEnter(e: KeyboardEvent) {
    if (e.target && e.target instanceof HTMLMapElement) {
      const id = Number(e.target.id);
      const el = this.processedElements.find(i => i.id === id);
      this._setActiveElement(el);
    }
  }

  /**
   * Clears the currently active element.
   */
  @Method()
  clearActiveElement() {
    this._clearActiveElement();
  }

  /**
   * Sets the element with the specified ID to active.
   *
   * @param id The ID of the element to set as active.
   */
  @Method()
  setActiveElement(id: number) {
    if (this.processedElements.length > 0) {
      this._setActiveElement(this.processedElements.find(i => i.id === id), false);
    }
  }

  /**
   * Clears the currently active element.
   */
  private _clearActiveElement() {
    if (this.activeElement) {
      // this.activeElement.isActive = false;
    }
    this.activeElement = undefined;
  }

  /**
   * Updates the min and max values the SVG transform can move to.  This is
   * used to restrict the values of `_svgTransform` so that the map can't be
   * dragged forever.
   */
  private _computeLimits() {
    const img = this._imgSize;
    const svg = this._svgSize;

    if (img === undefined || svg === undefined) {
      return;
    }

    this._limits = new DOMRect(
      Math.min(0, svg.width - img.width * this._svgScale),    // left / x
      Math.min(0, svg.height - img.height * this._svgScale),  // top / y
      Math.abs(img.width * this._svgScale - svg.width),       // width
      Math.abs(img.height * this._svgScale - svg.height)      // height
    );
  }

  /**
   * Computes the scale factor needed to resize the full map image to be as
   * large as possible, and cropping it vertically/horizontally so no empty
   * space exists if the container has different aspect from the image. This is
   * like CSS `background-size: cover` or SVG `aspectRatio xMidYMid slice`.
   */
  private _computeScale() {
    const img = this._imgSize;
    const svg = this._svgSize;

    if (img === undefined || svg === undefined) {
      this._svgScale = this._initialScale = 1;
    } else {
      this._svgScale = this._initialScale =
          Math.max(svg.width / img.width, svg.height / img.height);
    }
  }

  /**
   * Determines the current size of the SVG element serving as the container
   * for the entire map.
   */
  private _computeSvgSize() {
    const root = this.root.querySelector('svg');
    const svg = root && root.getBoundingClientRect();

    if (svg !== null) {
      this._svgSize = new DOMRect(0, 0, svg.width, svg.height);
    }
  }

  /**
   * Generates DOM content for the current list of `proccessedElements`.
   */
  private _renderElements() {
    const elements = this.processedElements;
    if (elements.length === 0) {
      return undefined;
    }

    const parsed = elements.map(el => {
      if (el.coordinates.length === 1) {
        const rectClass = {
          'rula-map-element__rect': true,
          'rula-map-element__rect--activated': el === this.activeElement, // el.isActive,
        };
        const gTrans = 'translate(' + (el.coordinates[0].x - CONTROL_SIZE / 2) + ' ' +
            (el.coordinates[0].y - CONTROL_SIZE / 2) + ')';

        if (el.icons && el.icons.length) {
          return el.icons.map(icon => {
            let iconAspect = icon.height / icon.width;

            if (isNaN(iconAspect)) {
              iconAspect = 1;
            }

            return (
              <g id={el.id} class="rula-map-element__point" tabindex="0" transform={gTrans}>
                <image
                  class="rula-map-element__icon"
                  // Don't set width.  Some icons are not square and leaving width
                  // unset will set the width automatically while keeping aspect.
                  height={CONTROL_SIZE}
                  xlinkHref={icon.src} />
                <rect
                  class={rectClass}
                  width={CONTROL_SIZE / iconAspect}
                  height={CONTROL_SIZE}
                  rx="12"
                  ry="12"/>
              </g>
            );
          });
        } else {
          // We have a text node.
          return (
            <text id={el.id} class="rula-map-element__text" transform={gTrans}>
              {el.name}
            </text>
          );
        }
      } else {
        const regionClass = {
          'rula-map-element__region': true,
          'rula-map-element__region--activated': el === this.activeElement, // el.isActive,
        };

        return (
          <path class={regionClass} id={el.id} d={el.path} tabindex="0"/>
        );
      }
    });

    return parsed;
  }

  /**
   * Sets the currently active element of the Map.
   *
   * @param el The Element that will be set as the active element.
   */
  private _setActiveElement(el?: ParsedMapElement, shouldEmit = true) {
    if (!el || (this.activeElement && el.id === this.activeElement.id)) {
      return;
    }

    this._clearActiveElement();
    this.activeElement = el;

    // Emit an event with the original (un-parsed) element as the new 'active'
    // element.  Don't emit an event if the flag is set.
    if (shouldEmit) {
      this.elementSelected.emit(this.elements[this.activeElement.id]);
    }
  }

  /**
   * Scales a given `Coordinate` by the inverse of the current `svgScale`.
   * Returns a new `Coordinate` with its values scaled and rounded.
   * @param c A `Coordinate` scale.
   */
  private _toSvgScale(c: Coordinate) {
    return c.clone().scale(1 / this._svgScale).round();
  }

  /**
   * Converts a given `Coordinate` object in screen coordinate space to SVG
   * coordinate space.
   * @param c A `Coordinate` to convert to SVG coordinate space.
   */
  private _toSvgSpace(c: Coordinate) {
    return difference(this._toSvgScale(c), this._toSvgScale(this._svgTransform));
  }

  hostData() {
    return {
      class: {
        'rula-map': true,
      },
    };
  }

  render() {
    const m = [
      this._svgScale, 0, 0, this._svgScale, this._svgTransform.x, this._svgTransform.y,
    ];
    const matrix = 'matrix(' + m.join(',') + ')';

    return (
      <svg class="rula-map__svg">
        <g class="rula-map__transform" transform={matrix}>
          <g class="rula-map__floorplan">
            <image class="rula-map__floorplan--image"
                xlinkHref={this.floorplan !== undefined ? this.floorplan : undefined}
                ref={(el: SVGImageElement) => this.floorplanImage = el}>
            </image>
          </g>
          <g class="rula-map__elements">
            {this._renderElements()}
          </g>
        </g>
      </svg>
    );
  }
}
