import type { ErrorResponse, Meta, SuccessResponse } from '../types';

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
} from '../utils';

const DEFAULT_MESSAGES: Readonly<Record<number, string>> = Object.freeze({
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
});

export interface CreateSuccessResponseOptions<
  TData,
  TStatusCode extends number,
> {
  success: true;
  statusCode: TStatusCode;
  defaultMessage?: string;
  message?: string;
  data?: TData;
  meta?: Meta;
}

export interface CreateErrorResponseOptions<
  TErrors,
  TStatusCode extends number,
> {
  success: false;
  statusCode: TStatusCode;
  defaultMessage?: string;
  message?: string;
  errors?: TErrors;
  meta?: Meta;
}

/**
 * Resolve the default message for a given response status.
 */
export function defaultMessageForStatus(
  statusCode: number,
  success: boolean
): string {
  return DEFAULT_MESSAGES[statusCode] || (success ? 'Success' : 'Error');
}

export function createResponse<TData, TStatusCode extends number>(
  options: CreateSuccessResponseOptions<TData, TStatusCode>
): SuccessResponse<TData, TStatusCode>;
export function createResponse<TErrors, TStatusCode extends number>(
  options: CreateErrorResponseOptions<TErrors, TStatusCode>
): ErrorResponse<TErrors, TStatusCode>;
/**
 * Build a standardized API response payload.
 */
export function createResponse<TData, TErrors, TStatusCode extends number>(
  options:
    | CreateSuccessResponseOptions<TData, TStatusCode>
    | CreateErrorResponseOptions<TErrors, TStatusCode>
): SuccessResponse<TData, TStatusCode> | ErrorResponse<TErrors, TStatusCode> {
  const { success, statusCode, defaultMessage, message, meta } = options;

  if (typeof success !== 'boolean') {
    throw new TypeError('Expected "success" to be a boolean.');
  }

  assertStatusCode(statusCode);

  if (!isPlainObject(meta) && meta !== undefined) {
    throw new TypeError('Expected "meta" to be a plain object when provided.');
  }

  if (success && !isSuccessStatus(statusCode)) {
    throw new RangeError('Success responses must use a 2xx HTTP status code.');
  }

  if (!success && !isErrorStatus(statusCode)) {
    throw new RangeError('Error responses must use a 4xx or 5xx status code.');
  }

  if (success && 'errors' in options && options.errors !== undefined) {
    throw new TypeError('Success responses cannot include "errors".');
  }

  if (!success && 'data' in options && options.data !== undefined) {
    throw new TypeError('Error responses cannot include "data".');
  }

  if (
    statusCode === 204 &&
    (('data' in options && options.data !== undefined) ||
      ('errors' in options && options.errors !== undefined))
  ) {
    throw new TypeError('A 204 response cannot include "data" or "errors".');
  }

  const resolvedMessage = assertMessage(
    message,
    defaultMessage || defaultMessageForStatus(statusCode, success)
  );
  const resolvedMeta = assertMeta(meta);

  if (success) {
    const data = assertAllowedPayload(options.data, 'data');

    return omitUndefined({
      success: true,
      status_code: statusCode,
      message: resolvedMessage,
      data: cloneValue(data),
      meta: resolvedMeta,
    }) as unknown as SuccessResponse<TData, TStatusCode>;
  }

  const errors = assertAllowedPayload(options.errors, 'errors');

  return omitUndefined({
    success: false,
    status_code: statusCode,
    message: resolvedMessage,
    errors: cloneValue(errors),
    meta: resolvedMeta,
  }) as unknown as ErrorResponse<TErrors, TStatusCode>;
}
