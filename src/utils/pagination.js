import { isPlainObject } from './object.js';

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`Expected "${name}" to be a positive integer.`);
  }
}

function assertNonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`Expected "${name}" to be a non-negative integer.`);
  }
}

/**
 * Build pagination metadata.
 *
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {number} options.total
 * @param {number} [options.total_pages]
 * @returns {object}
 */
export function paginationMeta(options) {
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

  const computedTotalPages =
    totalPagesInput !== undefined
      ? totalPagesInput
      : total === 0
        ? 0
        : Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    total_pages: computedTotalPages,
    has_prev_page: page > 1,
    has_next_page: computedTotalPages > 0 && page < computedTotalPages,
  };
}
