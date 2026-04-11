import type { Meta } from '../types';

import { cloneValue, isPlainObject } from './object';

/**
 * Merge meta objects from left to right without mutating inputs.
 */
export function mergeMeta(
  ...metaObjects: Array<Meta | undefined>
): Meta | undefined {
  const merged: Meta = {};

  for (const metaObject of metaObjects) {
    if (metaObject === undefined) {
      continue;
    }

    if (!isPlainObject(metaObject)) {
      throw new TypeError('Expected each meta value to be a plain object.');
    }

    Object.assign(merged, cloneValue(metaObject));
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}
