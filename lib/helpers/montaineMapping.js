/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));

const objectDeepKeys = (obj) => Object.keys(obj).filter((key) => obj[key] instanceof Object).map((key) => objectDeepKeys(obj[key]).map((k) => `${key}.${k}`)).reduce((x, y) => x.concat(y), Object.keys(obj));

const prepareFormat = (object, schema) => {
  const result = {};
  const keys = objectDeepKeys(schema);
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


exports.mapping = (json, schema) => {
  if (Array.isArray(json) && Array.isArray(schema)) {
    return json.map((j) => prepareFormat(j, schema[0]));
  } if (typeof example === 'object' && typeof data === 'object') {
    return prepareFormat(json, schema);
  }
  throw new AppError('Typing & scrap data return aren\'t arrays or objects', { code: 'HELPERS_ERROR' });
};
