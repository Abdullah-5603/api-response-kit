import type {
  ApiResponse,
  CustomResponseInput,
  Meta,
  SuccessResponse,
} from '../types';

import { assertPlainObject } from '../utils';

import { createResponse, defaultMessageForStatus } from './base';

/**
 * Build a 200 OK response.
 */
export function ok<TData>(
  data?: TData,
  meta?: Meta
): SuccessResponse<TData, 200> {
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
 */
export function created<TData>(
  data?: TData,
  meta?: Meta
): SuccessResponse<TData, 201> {
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
 */
export function accepted<TData>(
  data?: TData,
  meta?: Meta
): SuccessResponse<TData, 202> {
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
 */
export function noContent(meta?: Meta): SuccessResponse<never, 204> {
  return createResponse({
    success: true,
    statusCode: 204,
    defaultMessage: 'No Content',
    meta,
  });
}

/**
 * Build a custom standardized response.
 */
export function custom<TData = unknown, TErrors = unknown>(
  payload: CustomResponseInput<TData, TErrors>
): ApiResponse<TData, TErrors> {
  assertPlainObject<CustomResponseInput<TData, TErrors>>(payload, 'payload');

  const {
    success,
    status_code: statusCode,
    message,
    data,
    errors,
    meta,
  } = payload;

  if (success) {
    return createResponse({
      success: true,
      statusCode,
      defaultMessage: defaultMessageForStatus(statusCode, true),
      message,
      data,
      meta,
    });
  }

  return createResponse({
    success: false,
    statusCode,
    defaultMessage: defaultMessageForStatus(statusCode, false),
    message,
    errors,
    meta,
  });
}
