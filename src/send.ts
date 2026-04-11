import type { ApiResponse, ExpressLikeResponse } from './types';

import { assertStatusCode, isPlainObject } from './utils';

/**
 * Send a standardized payload with an Express-style response object.
 */
export function send<TPayload extends ApiResponse>(
  res: ExpressLikeResponse<TPayload>,
  payload: TPayload
): unknown {
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

  const response = res.status(statusCode);

  if (statusCode === 204) {
    if (!response || typeof response.send !== 'function') {
      throw new TypeError(
        'Expected "res.send" to be a function for 204 responses.'
      );
    }

    return response.send();
  }

  if (!response || typeof response.json !== 'function') {
    throw new TypeError('Expected "res.json" to be a function.');
  }

  return response.json(payload);
}
