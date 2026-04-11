import { createResponse } from './base.js';

function createErrorBuilder(statusCode, defaultMessage) {
  /**
   * @param {string} [message]
   * @param {Record<string, unknown>} [meta]
   * @returns {object}
   */
  return function buildError(message, meta) {
    return createResponse({
      success: false,
      statusCode,
      defaultMessage,
      message,
      meta,
    });
  };
}

function createErrorWithErrorsBuilder(statusCode, defaultMessage) {
  /**
   * @param {string} [message]
   * @param {*} [errors]
   * @param {Record<string, unknown>} [meta]
   * @returns {object}
   */
  return function buildError(message, errors, meta) {
    return createResponse({
      success: false,
      statusCode,
      defaultMessage,
      message,
      errors,
      meta,
    });
  };
}

/**
 * Build a 400 Bad Request response.
 */
export const badRequest = createErrorWithErrorsBuilder(400, 'Bad Request');

/**
 * Build a 401 Unauthorized response.
 */
export const unauthorized = createErrorBuilder(401, 'Unauthorized');

/**
 * Build a 403 Forbidden response.
 */
export const forbidden = createErrorBuilder(403, 'Forbidden');

/**
 * Build a 404 Not Found response.
 */
export const notFound = createErrorBuilder(404, 'Not Found');

/**
 * Build a 409 Conflict response.
 */
export const conflict = createErrorBuilder(409, 'Conflict');

/**
 * Build a 422 Unprocessable Entity response.
 */
export const unprocessableEntity = createErrorWithErrorsBuilder(
  422,
  'Unprocessable Entity'
);

/**
 * Build a 429 Too Many Requests response.
 */
export const tooManyRequests = createErrorBuilder(429, 'Too Many Requests');

/**
 * Build a 500 Internal Server Error response.
 */
export const error = createErrorBuilder(500, 'Internal Server Error');
