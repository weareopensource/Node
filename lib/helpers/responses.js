/**
 * @desc Function res success
 * @param {Object} res - Express response object
 * @param {String} success message
 * @return {Object} type, message and data
 */
exports.success = (res, message) => (data) => {
  res.status(200).json({ type: 'success', message, data });
};

/**
 * @desc Function res error
 * @param {Object} res - Express response object
 * @param {String} success message
* @return {Object} type, message and error
 */
exports.error = (res, code, message, description) => (error) => {
  res.status(code || error.code).json({
    type: 'error',
    message: message || error.message,
    code: code || error.code,
    description: description || error.description || error.details || '',
    error: JSON.stringify(error),
  });
};
