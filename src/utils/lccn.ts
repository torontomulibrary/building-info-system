/**
 * Compares two call numbers and returns whether or not `a` comes before or
 * after `b`.  If a call number comes 'before' another it is considered to be
 * 'less-than'.
 * @param a The first call number
 * @param b The second call number
 * @returns 1 if `a` is 'greater' than `b`, -1 if `b` is 'greater' than `a` or
 *    0 if the call numbers are the same.  Returns `undefined` if one of the
 *    call numbers was invalid.
 */
export function compareLCCN(a: string, b: string) {
  const re = /([A-Z]{1,3})(\d+\.?\d*)?\s?\.?((\.?[A-Z]\d{0,3})+)?\s?(\d{4})?/;
  const aRe = re.exec(a);
  const bRe = re.exec(b);

  if (aRe && bRe) {
    const aClass = aRe[1];
    const bClass = bRe[1];

    if (aClass === bClass) {
      // Class numbers are the same, need to continue analyzing.
      const aNumerals = Number(aRe[2]);
      const bNumerals = Number(bRe[2]);

      if (isNaN(aNumerals) || isNaN(bNumerals)) {
        // One of the numbers isn't a proper decimal, abort.
        return undefined;
      }

      if (aNumerals === bNumerals) {
        // Numerals are the same, need to continue analyzing.
        const aCutters = aRe[3].split('.');
        const bCutters = bRe[3].split('.');
        const comp = compareCutters(aCutters, bCutters);

        if (comp === 0) {
          // Cutters were the same, need to continue analyzing.
          const aYear = Number(aRe[5]);
          const bYear = Number(bRe[5]);

          if (isNaN(aYear) || isNaN(bYear)) {
            // One of the numbers isn't a proper decimal, abort.
            return undefined;
          }

          if (aYear === bYear) {
            return 0;
          } else {
            return aYear < bYear ? 1 : -1;
          }
        } else {
          return comp;
        }
      } else {
        // Can compare based on different numerals.
        return aNumerals < bNumerals ? 1 : -1;
      }
    } else {
      // Can compare based on different class number.
      return aClass < bClass ? 1 : -1;
    }
  }

  return undefined;
}

/**
 * Compares two arrays of cutter numbers.  A 'Cutter' number in the Library of
 * Congress clasification is a letter followed by digits.
 *
 * @param a The first array of cutter numbers to compare
 * @param b The second array of cutter numbers to compare
 * @returns 1 if `a < b`, -1 if `a > b` and 0 if `a == b`.
 */
function compareCutters(a: string[], b: string[]) {
  // In the case that one cutter is longer than the other, the shorter cutter
  // comes first (less-than).
  if (a.length === 0 && b.length > 0) {
    return 1;
  } else if (a.length > 0 && b.length === 0) {
    return -1;
  }

  // Need to iterate over both arrays, but don't want to go past the end of
  // one.
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const aChar = a[i].charAt(0);
    const aNum = Number(a[i].slice(1));
    const bChar = b[i].charAt(0);
    const bNum = Number(b[i].slice(1));
    if (aChar === bChar) {
      if (isNaN(aNum) && !isNaN(bNum)) {
        return 1;
      } else if (!isNaN(aNum) && isNaN(bNum)) {
        return -1;
      }

      if (aNum === bNum || isNaN(aNum) && isNaN(bNum)) {
        // The first cutter numbers are the same.
        compareCutters(a.slice(1), b.slice(1));
      } else {
        return aNum < bNum ? 1 : -1;
      }
    } else {
      return aChar < bChar ? 1 : -1;
    }
  }

  return 0;
}
