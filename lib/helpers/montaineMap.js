/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const tricks = require(path.resolve('./lib/helpers/tricks'));

/**
 * @desc Function to map object to a schema
 * @param {object} object - object to map
 * @param {schema} schema - schema to generate new object (key value, value = object path)
 * @return {object} object - new object generated
 */
const prepareFormat = (object, schema) => {
  const result = {};
  const keys = tricks.objectDeepKeys(schema);
  keys.forEach((k) => {
    const p = k.split('.');
    if (!(/^\d+$/.test(p[p.length - 1])) && !Array.isArray(_.get(schema, k))) {
      const targetPath = _.get(schema, k);
      const targetValue = _.get(object, targetPath);
      if (!targetValue) throw new AppError('Mapping : one of your path value is wrong.', { code: 'HELPERS_ERROR' });
      if (!Array.isArray(targetValue) && targetValue) {
        _.set(result, k, targetValue);
      } else {
        targetValue.forEach((v, i) => {
          const generatePath = p;
          generatePath[generatePath.length - 2] = i;
          _.set(result, generatePath.join('.'), v);
        });
        _.set(result, k, targetValue[0]);
      }
    }
  });
  return result;
};

/**
 * @desc mapping
 */
exports.map = (json, schema) => {
  if (Array.isArray(json) && Array.isArray(schema)) {
    return json.map((j) => prepareFormat(j, schema[0]));
  } if (typeof example === 'object' && typeof data === 'object') {
    return prepareFormat(json, schema);
  }
  throw new AppError('Typing & scrap data return aren\'t arrays or objects', { code: 'HELPERS_ERROR' });
};
