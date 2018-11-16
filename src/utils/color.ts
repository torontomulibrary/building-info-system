type RGB = number[];

/**
 * A class used to represent a color.  Based on color.js from the Google Closure
 * library.
 */
export class Color {

  /**
   * The primary components of the color (r, g, b).
   */
  private _color: RGB = [0, 0, 0];

  /**
   * The alpha channel of the color.
   */
  private _alpha = 1;

  constructor(r?: number, g?: number, b?: number, a?: number) {
    r = Number(r);
    g = Number(g);
    b = Number(b);
    a = Number(a);

    this._color = (r !== (r & 255) || g !== (g & 255) || b !== (b & 255)) ?
      [] : [r, g, b];

    this._alpha = (typeof a === 'number' && a >= 0 && a <= 1) ? a : 1;
  }

  setAlpha(a: number) {
    this._alpha = (typeof a === 'number' && a >= 0 && a <= 1) ? a : 1;
  }

  clone() {
    return new Color(this._color[0], this._color[1], this._color[2], this._alpha);
  }

  /**
   * Converts this color to an RGB string appropriate for CSS styles.
   */
  toRgb(): string {
    return (this._alpha && this._alpha !== 1) ?
      `rgba(${this._color.join(',')},${this._alpha})` :
      `rgb(${this._color.join(',')})`;
  }

  /**
   * Find the "best" (highest contrast) color from a list of options relative
   * to this color.
   *
   * @param options An array of `Color`s to search for contrast.
   * @returns The highest contrast color from the array of options
   */
  highContrast(options: Color[]): Color {
    const optionsWithDiff: Array<{color: Color, diff: number}> = [];
    const l = options.length;
    for (let i = 0; i < l; i++) {
      optionsWithDiff.push({
        color: options[i],
        diff: this._yiqBrightnessDiff(options[i]._color, this._color) +
            this._colorDiff(options[i]._color, this._color),
      });
    }

    optionsWithDiff.sort((a, b) => (b.diff - a.diff));
    return optionsWithDiff[0].color;
  }

  /**
   * Calculate the difference in brightness of two colors.
   *
   * @param rgb1 The first color to compare
   * @param rgb2 The second color to compare
   */
  _yiqBrightnessDiff(rgb1: RGB, rgb2: RGB): number {
    return Math.abs(
      this._yiqBrightness(rgb1) - this._yiqBrightness(rgb2));
  }

  /**
   * Calculate the brightness of a color according to the YIQ formula (where
   * brightness is Y).
   * @param rgb A color to calculate the brightness of
   * @returns The brightness (Y)
   */
  _yiqBrightness(rgb: RGB): number {
    return Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000);
  }

  _colorDiff(rgb1: RGB, rgb2: RGB): number {
    return Math.abs(rgb1[0] - rgb2[0]) + Math.abs(rgb1[1] - rgb2[1]) +
        Math.abs(rgb1[2] - rgb2[2]);
  }
}
