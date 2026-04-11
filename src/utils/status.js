/**
 * @param {number} statusCode
 * @returns {boolean}
 */
export function isSuccessStatus(statusCode) {
  return Number.isInteger(statusCode) && statusCode >= 200 && statusCode <= 299;
}

/**
 * @param {number} statusCode
 * @returns {boolean}
 */
export function isErrorStatus(statusCode) {
  return Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599;
}
