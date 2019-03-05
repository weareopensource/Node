/**
 * Module dependencies
 */
const path = require('path');

const config = require(path.resolve('./config'));

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = (err) => {
  let output;

  try {
    let begin = 0;
    if (err.errmsg.lastIndexOf('.$') !== -1) {
      // support mongodb <= 3.0 (default: MMapv1 engine)
      // "errmsg" : "E11000 duplicate key error index: mean-dev.users.$email_1 dup key: { : \"test@user.com\" }"
      begin = err.errmsg.lastIndexOf('.$') + 2;
    } else {
      // support mongodb >= 3.2 (default: WiredTiger engine)
      // "errmsg" : "E11000 duplicate key error collection: mean-dev.users index: email_1 dup key: { : \"test@user.com\" }"
      begin = err.errmsg.lastIndexOf('index: ') + 7;
    }
    const fieldName = err.errmsg.substring(begin, err.errmsg.lastIndexOf('_1'));
    output = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} already exists`;
  } catch (ex) {
    output = 'Unique field already exists';
  }

  return output;
};


/**
 * Get unique error field name
 */
const getErrorMessageFromCode = (err) => {
  let output;
  switch (err.code) {
    case 11000:
    case 11001:
      output = getUniqueErrorMessage(err);
      break;
    case 'UNSUPPORTED_MEDIA_TYPE':
      output = 'Unsupported filetype';
      break;
    case 'LIMIT_FILE_SIZE':
      output = `Image file too large. Maximum size allowed is ${(config.uploads.profile.avatar.limits.fileSize / (1024 * 1024)).toFixed(2)} Mb files.`;
      break;
    case 'LIMIT_UNEXPECTED_FILE':
      output = 'Missing `newProfilePicture` field';
      break;
    default:
      output = 'Something went wrong';
  }
  return output;
};

/**
 * Get Map Error
 */
const mapError = (err) => {
  let output = '';
  err.errors.map((error) => {
    if (error.message) {
      output = error.message;
    }
    return null;
  });
  return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = (err) => {
  let output = '';
  if (err.code) output = getErrorMessageFromCode(err);
  else if (err.message && !err.errors) output = err.message;
  else if (err.errors && typeof err.errors instanceof Array) output = err.errors;
  else if (err.errors && typeof err.errors instanceof String) output = mapError(err);
  else output = `error while retrieving the error :o : ${JSON.stringify(err)}`;
  return output;
};
