import { assertStatusCode, isPlainObject } from './utils/index.js';

/**
 * Send a standardized payload with an Express-style response object.
 *
 * @param {object} res
 * @param {object} payload
 * @returns {*}
 */
export function send(res, payload) {
  if (!res || typeof res !== 'object') {
    throw new TypeError('Expected "res" to be an object.');
  }

  if (typeof res.status !== 'function') {
    throw new TypeError('Expected "res.status" to be a function.');
  }

  if (!isPlainObject(payload)) {
    throw new TypeError('Expected "payload" to be a plain object.');
  }

  const statusCode = payload.status_code;

  assertStatusCode(statusCode);

  if (statusCode === 204) {
    if (typeof res.send !== 'function') {
      throw new TypeError(
        'Expected "res.send" to be a function for 204 responses.'
      );
    }

    return res.status(204).send();
  }

  if (typeof res.json !== 'function') {
    throw new TypeError('Expected "res.json" to be a function.');
  }

  return res.status(statusCode).json(payload);
}
