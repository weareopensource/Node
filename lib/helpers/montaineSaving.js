/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));

const objectDeepKeys = (obj) => Object.keys(obj).filter((key) => obj[key] instanceof Object).map((key) => objectDeepKeys(obj[key]).map((k) => `${key}.${k}`)).reduce((x, y) => x.concat(y), Object.keys(obj));

const prepareSave = (object, date) => {
  const result = {};
  const keys = objectDeepKeys(object);
  keys.forEach((k) => {
    const value = _.get(object, k);
    if (k.charAt(0) === '@') _.set(result, k, value);
    else if (!Array.isArray(value) && typeof value !== 'object') _.set(result, k, [{ updated: date, value }]);
  });
  return result;
};

exports.saving = (json, date) => {
  if (Array.isArray(json)) {
    return json.map((j) => prepareSave(j, date));
  } if (typeof example === 'object' && typeof data === 'object') {
    return prepareSave(json, date);
  }
  throw new AppError('Saving failed', { code: 'HELPERS_ERROR' });
};
