import {
  assertAllowedPayload,
  assertMessage,
  assertMeta,
  assertStatusCode,
  cloneValue,
  isErrorStatus,
  isPlainObject,
  isSuccessStatus,
  omitUndefined,
} from '../utils/index.js';

/**
 * Build a standardized API response payload.
 *
 * @param {object} options
 * @param {boolean} options.success
 * @param {number} options.statusCode
 * @param {string} options.defaultMessage
 * @param {string} [options.message]
 * @param {*} [options.data]
 * @param {*} [options.errors]
 * @param {Record<string, unknown>} [options.meta]
 * @returns {object}
 */
export function createResponse({
  success,
  statusCode,
  defaultMessage,
  message,
  data,
  errors,
  meta,
}) {
  if (typeof success !== 'boolean') {
    throw new TypeError('Expected "success" to be a boolean.');
  }

  assertStatusCode(statusCode);

  if (!isPlainObject(meta) && meta !== undefined) {
    throw new TypeError('Expected "meta" to be a plain object when provided.');
  }

  if (success && !isSuccessStatus(statusCode)) {
    throw new RangeError(
      'Success responses must use a 2xx HTTP status code.'
    );
  }

  if (!success && !isErrorStatus(statusCode)) {
    throw new RangeError('Error responses must use a 4xx or 5xx status code.');
  }

  if (success && errors !== undefined) {
    throw new TypeError('Success responses cannot include "errors".');
  }

  if (!success && data !== undefined) {
    throw new TypeError('Error responses cannot include "data".');
  }

  if (statusCode === 204 && (data !== undefined || errors !== undefined)) {
    throw new TypeError('A 204 response cannot include "data" or "errors".');
  }

  const resolvedMessage = assertMessage(message, defaultMessage);
  const resolvedMeta = assertMeta(meta);
  const resolvedData = assertAllowedPayload(data, 'data');
  const resolvedErrors = assertAllowedPayload(errors, 'errors');

  return omitUndefined({
    success,
    status_code: statusCode,
    message: resolvedMessage,
    data: cloneValue(resolvedData),
    errors: cloneValue(resolvedErrors),
    meta: resolvedMeta,
  });
}
