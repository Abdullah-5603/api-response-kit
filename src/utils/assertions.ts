import type { Meta } from '../types';

import { mergeMeta } from './meta';
import { isPlainObject } from './object';

/**
 * Validate an HTTP status code.
 */
export function assertStatusCode(value: number): number {
  if (!Number.isInteger(value) || value < 100 || value > 599) {
    throw new RangeError(
      'Expected "statusCode" to be an integer between 100 and 599.'
    );
  }

  return value;
}

/**
 * Validate an optional message and fall back to a default.
 */
export function assertMessage(
  value: string | undefined,
  fallback: string
): string {
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
 * Validate an optional meta object.
 */
export function assertMeta(value: Meta | undefined): Meta | undefined {
  if (value === undefined) {
    return undefined;
  }

  return mergeMeta(value);
}

/**
 * Validate that a top-level payload value is serializable enough for JSON responses.
 */
export function assertAllowedPayload<T>(
  value: T | undefined,
  name: string
): T | undefined {
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
 * Assert that a value is a plain object.
 */
export function assertPlainObject<T>(value: unknown, name = 'value'): T {
  if (!isPlainObject(value)) {
    throw new TypeError(`Expected "${name}" to be a plain object.`);
  }

  return value as T;
}
