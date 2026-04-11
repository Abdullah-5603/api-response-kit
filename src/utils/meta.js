import { cloneValue, isPlainObject } from './object.js';

/**
 * Merge meta objects from left to right without mutation.
 *
 * @param {...Record<string, unknown>} metaObjects
 * @returns {Record<string, unknown>|undefined}
 */
export function mergeMeta(...metaObjects) {
  const merged = {};

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
