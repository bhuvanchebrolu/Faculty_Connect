class ApiError extends Error {
  /**
   * @param {number} statusCode  – the HTTP status to send back (400, 403, 404, etc.)
   * @param {string} message     – the human-readable error message for the response body
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
