/**
 * Sends an error response with the specified status code and message.
 *
 * @param {object} res - The response object.
 * @param {number} status - The HTTP status code.
 * @param {string} message - The error message to be sent.
 */
export function errorResponse(res, status, message) {
  res.status(status).json({ message, status });
  return;
}

/**
 * Sends a success response with the specified status code and data.
 *
 * @param {object} res - The response object.
 * @param {number} status - The HTTP status code (defaults to 200 if not provided).
 * @param {object} data - The data to be sent in the response.
 */
export function successResponse(res, status = 200, data) {
  res.status(status).json(data);
  return;
}
