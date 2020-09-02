/**
 * @desc Function res success
 * @param {Object} res - Express response object
 * @param {String} success message
 * @return {Object} type, message and data
 */
exports.success = (res, message) => (data) => {
  const result = { type: 'success', message, data };
  res.status(200).json(result);
  return result;
};

/**
 * @desc Function res error
 * @param {Object} res - Express response object
 * @param {String} success message
 * @return {Object} type, message and error
 */
exports.error = (res, code, message, description) => (error) => {
  const result = {
    type: 'error',
    message: message || error.message,
    code: code || error.code,
    description: description || error.description || error.details || '',
    error: JSON.stringify(error),
  };
  res.status(code || error.code).json(result);
  return result;
};
