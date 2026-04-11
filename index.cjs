'use strict';

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function cloneValue(value) {
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

function omitUndefined(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  );
}

function assertStatusCode(value) {
  if (!Number.isInteger(value) || value < 100 || value > 599) {
    throw new RangeError(
      'Expected "statusCode" to be an integer between 100 and 599.'
    );
  }

  return value;
}

function assertMessage(value, fallback) {
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

function mergeMeta() {
  const metaObjects = Array.from(arguments);
  const merged = {};

  for (const metaObject of metaObjects) {
    if (metaObject === undefined) {
      continue;
    }

    if (!isPlainObject(metaObject)) {
      throw new TypeError('Expected each meta value to be a plain object.');
    }

    Object.assign(merged, cloneValue(metaObject));
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}

function assertMeta(value) {
  if (value === undefined) {
    return undefined;
  }

  return mergeMeta(value);
}

function assertAllowedPayload(value, name) {
  if (value === undefined) {
    return undefined;
  }

  const type = typeof value;

  if (type === 'function' || type === 'symbol' || type === 'bigint') {
    throw new TypeError(`Expected "${name}" to be JSON-serializable.`);
  }

  return value;
}

function createResponse(options) {
  const {
    success,
    statusCode,
    defaultMessage,
    message,
    data,
    errors,
    meta,
  } = options;

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

  return omitUndefined({
    success,
    status_code: statusCode,
    message: assertMessage(message, defaultMessage),
    data: cloneValue(assertAllowedPayload(data, 'data')),
    errors: cloneValue(assertAllowedPayload(errors, 'errors')),
    meta: assertMeta(meta),
  });
}

function ok(data, meta) {
  return createResponse({
    success: true,
    statusCode: 200,
    defaultMessage: 'OK',
    data,
    meta,
  });
}

function created(data, meta) {
  return createResponse({
    success: true,
    statusCode: 201,
    defaultMessage: 'Created',
    data,
    meta,
  });
}

function accepted(data, meta) {
  return createResponse({
    success: true,
    statusCode: 202,
    defaultMessage: 'Accepted',
    data,
    meta,
  });
}

function noContent(meta) {
  return createResponse({
    success: true,
    statusCode: 204,
    defaultMessage: 'No Content',
    meta,
  });
}

function createErrorBuilder(statusCode, defaultMessage) {
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
  return function buildError(message, errorsOrMeta, meta) {
    return createResponse({
      success: false,
      statusCode,
      defaultMessage,
      message,
      errors: errorsOrMeta,
      meta,
    });
  };
}

const badRequest = createErrorWithErrorsBuilder(400, 'Bad Request');
const unauthorized = createErrorBuilder(401, 'Unauthorized');
const forbidden = createErrorBuilder(403, 'Forbidden');
const notFound = createErrorBuilder(404, 'Not Found');
const conflict = createErrorBuilder(409, 'Conflict');
const unprocessableEntity = createErrorWithErrorsBuilder(
  422,
  'Unprocessable Entity'
);
const tooManyRequests = createErrorBuilder(429, 'Too Many Requests');
const error = createErrorBuilder(500, 'Internal Server Error');

function custom(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('Expected "payload" to be a plain object.');
  }

  return createResponse({
    success: payload.success,
    statusCode: payload.status_code,
    defaultMessage: payload.success ? 'OK' : 'Error',
    message: payload.message,
    data: payload.data,
    errors: payload.errors,
    meta: payload.meta,
  });
}

function isSuccessStatus(statusCode) {
  return Number.isInteger(statusCode) && statusCode >= 200 && statusCode <= 299;
}

function isErrorStatus(statusCode) {
  return Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599;
}

function paginationMeta(options) {
  if (!isPlainObject(options)) {
    throw new TypeError('Expected "options" to be a plain object.');
  }

  const { page, limit, total, total_pages: totalPagesInput } = options;

  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('Expected "page" to be a positive integer.');
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('Expected "limit" to be a positive integer.');
  }

  if (!Number.isInteger(total) || total < 0) {
    throw new RangeError('Expected "total" to be a non-negative integer.');
  }

  if (
    totalPagesInput !== undefined &&
    (!Number.isInteger(totalPagesInput) || totalPagesInput < 0)
  ) {
    throw new RangeError('Expected "total_pages" to be a non-negative integer.');
  }

  const totalPages =
    totalPagesInput !== undefined
      ? totalPagesInput
      : total === 0
        ? 0
        : Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    total_pages: totalPages,
    has_prev_page: page > 1,
    has_next_page: totalPages > 0 && page < totalPages,
  };
}

function send(res, payload) {
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

module.exports = {
  accepted,
  badRequest,
  conflict,
  created,
  custom,
  error,
  forbidden,
  isErrorStatus,
  isSuccessStatus,
  mergeMeta,
  noContent,
  notFound,
  ok,
  paginationMeta,
  send,
  tooManyRequests,
  unauthorized,
  unprocessableEntity,
};
