/**
 * @desc Function res success
 * @param {Object} res - Express response object
 * @param {String} success message
 * @return {Object} type, message and data
 */
const success = (res, message) => (data) => {
  const result = { type: 'success', message, data };
  try {
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
  return result;
};

/**
 * @desc Function res error
 * @param {Object} res - Express response object
 * @param {String} success message
 * @return {Object} type, message and error
 */
const error = (res, code, message, description) => (error) => {
  const result = {
    type: 'error',
    message: message || error.message,
    code: code || error.code,
    description: description || error.description || error.details || '',
    error: JSON.stringify(error),
  };
  try {
    res.status(code || error.code).json(result);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
  return result;
};

export default {
  success,
  error,
};
