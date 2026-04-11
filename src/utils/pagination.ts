import type { PaginationDetails, PaginationMetaInput } from '../types';

import { isPlainObject } from './object';

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`Expected "${name}" to be a positive integer.`);
  }
}

function assertNonNegativeInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`Expected "${name}" to be a non-negative integer.`);
  }
}

/**
 * Build deterministic pagination metadata.
 */
export function paginationMeta(
  options: PaginationMetaInput
): PaginationDetails {
  if (!isPlainObject(options)) {
    throw new TypeError('Expected "options" to be a plain object.');
  }

  const { page, limit, total, total_pages: totalPagesInput } = options;

  assertPositiveInteger(page, 'page');
  assertPositiveInteger(limit, 'limit');
  assertNonNegativeInteger(total, 'total');

  if (totalPagesInput !== undefined) {
    assertNonNegativeInteger(totalPagesInput, 'total_pages');
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
