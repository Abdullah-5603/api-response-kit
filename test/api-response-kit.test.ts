import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
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
} from '../src';
import type { ErrorResponse, PaginationDetails, SuccessResponse } from '../src';

describe('success builders', () => {
  it('builds an OK payload', () => {
    expect(ok({ id: 1 }, { request_id: 'req-1' })).toEqual({
      success: true,
      status_code: 200,
      message: 'OK',
      data: { id: 1 },
      meta: { request_id: 'req-1' },
    });
  });

  it('builds a Created payload', () => {
    expect(created({ id: 2 })).toEqual({
      success: true,
      status_code: 201,
      message: 'Created',
      data: { id: 2 },
    });
  });

  it('builds an Accepted payload', () => {
    expect(accepted({ queued: true })).toEqual({
      success: true,
      status_code: 202,
      message: 'Accepted',
      data: { queued: true },
    });
  });

  it('omits undefined data', () => {
    expect(ok(undefined)).toEqual({
      success: true,
      status_code: 200,
      message: 'OK',
    });
  });

  it('builds a no-content payload', () => {
    expect(noContent({ trace_id: 'trace-1' })).toEqual({
      success: true,
      status_code: 204,
      message: 'No Content',
      meta: { trace_id: 'trace-1' },
    });
  });
});

describe('error builders', () => {
  it('builds a bad request payload with errors and meta', () => {
    expect(
      badRequest('Validation failed', [{ field: 'email' }], { request_id: '1' })
    ).toEqual({
      success: false,
      status_code: 400,
      message: 'Validation failed',
      errors: [{ field: 'email' }],
      meta: { request_id: '1' },
    });
  });

  it('builds default error payloads', () => {
    expect(unauthorized()).toEqual({
      success: false,
      status_code: 401,
      message: 'Unauthorized',
    });
    expect(forbidden()).toEqual({
      success: false,
      status_code: 403,
      message: 'Forbidden',
    });
    expect(notFound()).toEqual({
      success: false,
      status_code: 404,
      message: 'Not Found',
    });
    expect(conflict()).toEqual({
      success: false,
      status_code: 409,
      message: 'Conflict',
    });
    expect(tooManyRequests()).toEqual({
      success: false,
      status_code: 429,
      message: 'Too Many Requests',
    });
    expect(error()).toEqual({
      success: false,
      status_code: 500,
      message: 'Internal Server Error',
    });
  });

  it('builds an unprocessable entity payload', () => {
    expect(
      unprocessableEntity('Invalid payload', { email: ['Already used'] })
    ).toEqual({
      success: false,
      status_code: 422,
      message: 'Invalid payload',
      errors: { email: ['Already used'] },
    });
  });

  it('omits undefined errors', () => {
    expect(badRequest()).toEqual({
      success: false,
      status_code: 400,
      message: 'Bad Request',
    });
  });
});

describe('custom()', () => {
  it('builds custom success payloads with a status-derived default message', () => {
    expect(
      custom({ success: true, status_code: 201, data: { id: 3 } })
    ).toEqual({
      success: true,
      status_code: 201,
      message: 'Created',
      data: { id: 3 },
    });
  });

  it('builds custom error payloads', () => {
    expect(
      custom({
        success: false,
        status_code: 409,
        message: 'Duplicate slug',
        errors: [{ field: 'slug' }],
        meta: { request_id: 'req-9' },
      })
    ).toEqual({
      success: false,
      status_code: 409,
      message: 'Duplicate slug',
      errors: [{ field: 'slug' }],
      meta: { request_id: 'req-9' },
    });
  });

  it('rejects invalid custom payloads', () => {
    expect(() => custom(null as never)).toThrow(
      'Expected "payload" to be a plain object.'
    );
    expect(() => custom({ success: true, status_code: 400 })).toThrow(
      'Success responses must use a 2xx HTTP status code.'
    );
    expect(() => custom({ success: false, status_code: 200 })).toThrow(
      'Error responses must use a 4xx or 5xx status code.'
    );
  });
});

describe('validation', () => {
  it('rejects invalid messages and status codes', () => {
    expect(() => badRequest('')).toThrow(
      'Expected "message" to be a non-empty string when provided.'
    );
    expect(() => custom({ success: true, status_code: 99 })).toThrow(
      'Expected "statusCode" to be an integer between 100 and 599.'
    );
  });

  it('rejects invalid payload data', () => {
    expect(() => ok((() => undefined) as never)).toThrow(
      'Expected "data" to be JSON-serializable.'
    );
    expect(() => badRequest('Failed', BigInt(1) as never)).toThrow(
      'Expected "errors" to be JSON-serializable.'
    );
  });

  it('rejects 204 payloads with a body', () => {
    expect(() =>
      custom({ success: true, status_code: 204, data: { invalid: true } })
    ).toThrow('A 204 response cannot include "data" or "errors".');
  });
});

describe('mergeMeta()', () => {
  it('merges meta objects without mutation', () => {
    const left = { request_id: 'req-1', nested: { page: 1 } };
    const right = { locale: 'en', nested: { page: 2 } };

    const merged = mergeMeta(left, undefined, right);

    expect(merged).toEqual({
      request_id: 'req-1',
      locale: 'en',
      nested: { page: 2 },
    });
    expect(left).toEqual({ request_id: 'req-1', nested: { page: 1 } });
    expect(right).toEqual({ locale: 'en', nested: { page: 2 } });
  });

  it('returns undefined when nothing is provided', () => {
    expect(mergeMeta()).toBeUndefined();
  });

  it('rejects non-object meta values', () => {
    expect(() => mergeMeta('nope' as never)).toThrow(
      'Expected each meta value to be a plain object.'
    );
  });
});

describe('paginationMeta()', () => {
  it('computes pagination metadata', () => {
    expect(paginationMeta({ page: 2, limit: 10, total: 45 })).toEqual({
      page: 2,
      limit: 10,
      total: 45,
      total_pages: 5,
      has_prev_page: true,
      has_next_page: true,
    });
  });

  it('respects an explicit total_pages override', () => {
    expect(
      paginationMeta({ page: 1, limit: 25, total: 20, total_pages: 3 })
    ).toEqual({
      page: 1,
      limit: 25,
      total: 20,
      total_pages: 3,
      has_prev_page: false,
      has_next_page: true,
    });
  });

  it('handles empty collections', () => {
    expect(paginationMeta({ page: 1, limit: 10, total: 0 })).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 0,
      has_prev_page: false,
      has_next_page: false,
    });
  });

  it('rejects invalid pagination input', () => {
    expect(() => paginationMeta({ page: 0, limit: 10, total: 1 })).toThrow(
      'Expected "page" to be a positive integer.'
    );
  });
});

describe('status helpers', () => {
  it('identifies success and error status codes', () => {
    expect(isSuccessStatus(200)).toBe(true);
    expect(isSuccessStatus(204)).toBe(true);
    expect(isSuccessStatus(399)).toBe(false);
    expect(isErrorStatus(404)).toBe(true);
    expect(isErrorStatus(500)).toBe(true);
    expect(isErrorStatus(299)).toBe(false);
  });
});

describe('send()', () => {
  it('sends JSON payloads through Express-like responses', () => {
    const json = vi.fn().mockReturnValue('json-result');
    const status = vi.fn().mockReturnValue({ json });
    const res = { status };
    const payload = ok({ hello: 'world' });

    const result = send(res, payload);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(payload);
    expect(result).toBe('json-result');
  });

  it('sends empty 204 responses without a body', () => {
    const sendSpy = vi.fn().mockReturnValue('send-result');
    const status = vi.fn().mockReturnValue({ send: sendSpy });
    const res = { status };

    const result = send(res, noContent());

    expect(status).toHaveBeenCalledWith(204);
    expect(sendSpy).toHaveBeenCalledWith();
    expect(result).toBe('send-result');
  });

  it('rejects invalid response objects and payloads', () => {
    expect(() => send({} as never, ok({ id: 1 }))).toThrow(
      'Expected "res.status" to be a function.'
    );
    expect(() =>
      send({ status: () => ({ json: () => null }) }, null as never)
    ).toThrow('Expected "payload" to be a plain object.');
    expect(() =>
      send({ status: () => ({ send: () => null }) }, {
        status_code: 99,
      } as never)
    ).toThrow('Expected "statusCode" to be an integer between 100 and 599.');
  });
});

describe('type surface', () => {
  it('exposes useful response typings for consumers', () => {
    const successPayload = ok({ id: 1 });
    const errorPayload = badRequest('Invalid');
    const pageMeta = paginationMeta({ page: 1, limit: 10, total: 0 });

    expectTypeOf(successPayload).toEqualTypeOf<
      SuccessResponse<{ id: number }, 200>
    >();
    expectTypeOf(errorPayload).toEqualTypeOf<ErrorResponse<unknown, 400>>();
    expectTypeOf(pageMeta).toEqualTypeOf<PaginationDetails>();
  });
});
