import { createResponse } from './base.js';

/**
 * Build a 200 OK response.
 *
 * @param {*} data
 * @param {Record<string, unknown>} [meta]
 * @returns {object}
 */
export function ok(data, meta) {
  return createResponse({
    success: true,
    statusCode: 200,
    defaultMessage: 'OK',
    data,
    meta,
  });
}

/**
 * Build a 201 Created response.
 *
 * @param {*} data
 * @param {Record<string, unknown>} [meta]
 * @returns {object}
 */
export function created(data, meta) {
  return createResponse({
    success: true,
    statusCode: 201,
    defaultMessage: 'Created',
    data,
    meta,
  });
}

/**
 * Build a 202 Accepted response.
 *
 * @param {*} data
 * @param {Record<string, unknown>} [meta]
 * @returns {object}
 */
export function accepted(data, meta) {
  return createResponse({
    success: true,
    statusCode: 202,
    defaultMessage: 'Accepted',
    data,
    meta,
  });
}

/**
 * Build a 204 No Content response.
 *
 * @param {Record<string, unknown>} [meta]
 * @returns {object}
 */
export function noContent(meta) {
  return createResponse({
    success: true,
    statusCode: 204,
    defaultMessage: 'No Content',
    meta,
  });
}

/**
 * Build a custom standardized response.
 *
 * @param {object} payload
 * @param {boolean} payload.success
 * @param {number} payload.status_code
 * @param {string} [payload.message]
 * @param {*} [payload.data]
 * @param {*} [payload.errors]
 * @param {Record<string, unknown>} [payload.meta]
 * @returns {object}
 */
export function custom(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('Expected "payload" to be a plain object.');
  }

  const {
    success,
    status_code: statusCode,
    message,
    data,
    errors,
    meta,
  } = payload;

  return createResponse({
    success,
    statusCode,
    defaultMessage: success ? 'OK' : 'Error',
    message,
    data,
    errors,
    meta,
  });
}
