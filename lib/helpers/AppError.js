/**
 * Custom Errors with Node + Express
 */
const AppErrorCodes = {
  serverError: 'SERVER_ERROR',
};

class AppError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);

    // Set HTTP status code
    this.status = status || 500;

    // Set API error code
    this.code = code || AppErrorCodes.serverError;

    // Ensures that stack trace uses our subclass name
    this.name = this.constructor.name;

    // Ensures the AppError subclass is sliced out of the
    // stack trace dump for clarity
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
