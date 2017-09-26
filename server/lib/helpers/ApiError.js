'use strict'

const ApiErrorCodes = {
  serverError: 'SERVER_ERROR'
}

class ApiError extends Error {
  constructor (message, {status, code} = {}) {
    super(message)

    // Set HTTP status code
    this.status = status || 500

    // Set API error code
    this.code = code || ApiErrorCodes.serverError

    // Ensures that stack trace uses our subclass name
    this.name = this.constructor.name

    // Ensures the ApiError subclass is sliced out of the
    // stack trace dump for clarity
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ApiError
