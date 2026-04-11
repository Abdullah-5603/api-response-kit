/**
 * @param {*} value
 * @returns {value is Record<string, unknown>}
 */
export function isPlainObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

/**
 * Clone arrays and plain objects shallowly to avoid mutating caller input.
 *
 * @param {*} value
 * @returns {*}
 */
export function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)])
    );
  }

  return value;
}

/**
 * Remove undefined keys from an object.
 *
 * @param {Record<string, unknown>} value
 * @returns {Record<string, unknown>}
 */
export function omitUndefined(value) {
  const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);

  return Object.fromEntries(entries);
}
