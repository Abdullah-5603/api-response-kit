/**
 * Check whether a status code is a 2xx success code.
 */
export function isSuccessStatus(statusCode: number): boolean {
  return Number.isInteger(statusCode) && statusCode >= 200 && statusCode <= 299;
}

/**
 * Check whether a status code is a 4xx or 5xx error code.
 */
export function isErrorStatus(statusCode: number): boolean {
  return Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599;
}
