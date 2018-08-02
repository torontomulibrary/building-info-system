import { Component, Prop } from '@stencil/core';

/**
 * @name GrapicDevice
 * @module Rula
 * @description A list item link
 */
@Component({
  tag: 'rula-graphic-device',
  styleUrl: 'graphic-device.scss'
})

export class GrapicDevice {
  @Prop() height: number;
  @Prop() width: number;

  paths: {data: string, color: string}[] = [];

  pathData: string[] = ["-5,-5, 100,-5 100,100, -5,100"];
  colors: string[] = ['#004c9b', '#ffdc00', '#ffa300', '#ffee00', '#002d72', '#00a9ef'];

  render() {
    const vb = '0 0 ' + this.width + ' ' + this.height;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={vb} align="xMinYMid slice">
        {this.paths.map((path) =>
          <path d={path.data} fill={path.color}></path>
        )}
      </svg>
    );
  }

  componentWillLoad() {
    let possibleColors = [...this.colors];

    for (let i = 0; i < 3; i++) {
      // Generate two x-coordinates such that x1 < x2 and x1 != x2
      let x1 = Math.round(Math.random() * this.width * 1.4 - (this.height * 0.2));
      let t = 0;
      do {
        t = Math.round(Math.random() * this.width);
      } while (t == x1 || Math.abs(t - x1) < (this.width * 0.3));

      let x2 = 0;
      if (t > x1) {
        x2 = t;
      } else {
        x2 = x1;
        x1 = t;
      }

      let y1 = Math.round(Math.random() * this.height - (this.height * 0.2));
      do {
        t = Math.round(Math.random() * this.height);
      } while (t == y1 || Math.abs(t - y1) < (this.height * 0.3));

      let y2 = 0;
      if (t > y1) {
        y2 = t;
      } else {
        y2 = y1;
        y1 = t;
      }

      let points = [
        x1 + ',' + y1,
        x2 + ',' + y1,
        x2 + ',' + y2,
        x1 + ',' + y2
      ].join(' ');

      let index = Math.floor(Math.random() * possibleColors.length);
      let color = possibleColors[index];
      possibleColors.splice(index, 1);

      this.paths = [...this.paths, {data: 'M ' + points, color: color}];
    }
  }
}
