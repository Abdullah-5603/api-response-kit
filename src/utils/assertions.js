import { isPlainObject } from './object.js';
import { mergeMeta } from './meta.js';

/**
 * @param {number} value
 * @returns {number}
 */
export function assertStatusCode(value) {
  if (!Number.isInteger(value) || value < 100 || value > 599) {
    throw new RangeError(
      'Expected "statusCode" to be an integer between 100 and 599.'
    );
  }

  return value;
}

/**
 * @param {string} value
 * @param {string} fallback
 * @returns {string}
 */
export function assertMessage(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(
      'Expected "message" to be a non-empty string when provided.'
    );
  }

  return value;
}

/**
 * @param {Record<string, unknown>} [value]
 * @returns {Record<string, unknown>|undefined}
 */
export function assertMeta(value) {
  if (value === undefined) {
    return undefined;
  }

  return mergeMeta(value);
}

/**
 * @param {*} value
 * @param {string} name
 * @returns {*}
 */
export function assertAllowedPayload(value, name) {
  if (value === undefined) {
    return undefined;
  }

  const type = typeof value;

  if (type === 'function' || type === 'symbol' || type === 'bigint') {
    throw new TypeError(`Expected "${name}" to be JSON-serializable.`);
  }

  return value;
}

/**
 * @param {*} value
 * @returns {*}
 */
export function assertPlainObject(value) {
  if (!isPlainObject(value)) {
    throw new TypeError('Expected a plain object.');
  }

  return value;
}
