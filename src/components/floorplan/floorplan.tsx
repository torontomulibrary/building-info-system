import {
  LIB02Flat,
  LIB02Ortho,
  LIB03Flat,
  LIB03Ortho,
  LIB04Flat,
  LIB04Ortho,
  LIB05Flat,
  LIB05Ortho,
  LIB06Flat,
  LIB06Ortho,
  LIB07Flat,
  LIB07Ortho,
  LIB08Flat,
  LIB08Ortho,
  LIB09Flat,
  LIB09Ortho,
  LIB10Flat,
  LIB10Ortho,
} from '@ryersonlibrary/floorplans';
import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

import { SVGContent } from './content';
import { SVGDefs } from './defs';

@Component({
  tag: 'rl-floorplan',
  styleUrl: 'floorplan.scss',
  shadow: true,
})
export class LibraryFloorplan {
  private data = {
    'LIB-02' : { 'flat': LIB02Flat, 'ortho': LIB02Ortho },
    'LIB-03' : { 'flat': LIB03Flat, 'ortho': LIB03Ortho },
    'LIB-04' : { 'flat': LIB04Flat, 'ortho': LIB04Ortho },
    'LIB-05' : { 'flat': LIB05Flat, 'ortho': LIB05Ortho },
    'LIB-06' : { 'flat': LIB06Flat, 'ortho': LIB06Ortho },
    'LIB-07' : { 'flat': LIB07Flat, 'ortho': LIB07Ortho },
    'LIB-08' : { 'flat': LIB08Flat, 'ortho': LIB08Ortho },
    'LIB-09' : { 'flat': LIB09Flat, 'ortho': LIB09Ortho },
    'LIB-10' : { 'flat': LIB10Flat, 'ortho': LIB10Ortho },
  };

  /**
   * Event fired when an element in the SVG is clicked (if it is clickable).
   * Details will be the `id` of the clicked element.
   */
  @Event() rlElementClicked!: EventEmitter<string>;

  /**
   * Event fired when the SVG is clicked but no specific element is targeted,
   * that is, the active element is cleared.
   */
  @Event() rlElementCleared!: EventEmitter<void>;

  /**
   * The ID of the floorplan to display.
   */
  @Prop() floorId?: string;

  /**
   * The width for the SVG element.
   */
  @Prop() width = '4800';

  /**
   * The height for the SVG element.
   */
  @Prop() height = '2400';

  /**
   * The height of the SVG viewbox.
   */
  @Prop() vbWidth = this.width;

  /**
   * The width of the SVG viewbox.
   */
  @Prop() vbHeight = this.height;

  /**
   * Setting to true adds a viewbox attribute to the SVG element.
   */
  @Prop() useViewbox = false;

  /**
   * Setting to use the orthographic variant of the floorplan.
   */
  @Prop() useOrtho = false;

  /**
   * An array of extra attributes that will be assigned to each element based
   * on the element's code.
   */
  @Prop() extraElementData?: {[key: string]: { [key: string]: string }};

  render() {
    const elements = this.floorId !== undefined && this.data[this.floorId] !== undefined
        ? this.data[this.floorId][this.useOrtho ? 'ortho' : 'flat']
        : [{
            'elem': 'text',
            'prefix': '',
            'local': 'text',
            'attrs': {
              'style': 'font-size: 72px; text-anchor: middle;',
              'x': '50%',
              'y': '50%',
            },
            'content': [{
              'text': 'No SVG Specified',
            }],
          }];

    return (
      <Host class="rl-floorplan">
        <svg
          width={this.width}
          height={this.height}
          viewBox={this.useViewbox ? `0 0 ${this.vbWidth} ${this.vbHeight}` : undefined}
          class="rl-floorplan__svg"
          onClick={(e: MouseEvent) => {
            if (e.target instanceof SVGElement && e.target.classList.contains('rl-clickable')) {
              this.rlElementClicked.emit(e.target.id);
            } else {
              this.rlElementCleared.emit();
            }
          }}
        >
          <SVGDefs></SVGDefs>
          <g>
            <SVGContent elements={elements} extra={this.extraElementData}></SVGContent>
          </g>
        </svg>
      </Host>
    );
  }

}
