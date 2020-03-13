/**
 * Module dependencies
 */
const moment = require('moment');
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));


/**
 * @desc t
 * @param {Object} p - params
 * @return {Object} result - params generated
 */
const objectDeepKeys = (obj) => Object.keys(obj).filter((key) => obj[key] instanceof Object).map((key) => objectDeepKeys(obj[key]).map((k) => `${key}.${k}`)).reduce((x, y) => x.concat(y), Object.keys(obj));

const format = (data, action, object) => {
  const func = action.split('(')[0];
  const param = action.split('(')[1].slice(0, -1);

  switch (func) {
    case 'DATE':
      try {
        return moment(new Date(data)).format();
      } catch (err) {
        throw new AppError('Typing : format DATE error', { code: 'HELPERS_ERROR', details: err });
      }
    case 'NUMBER':
      try {
        data = String(data).replace(/,/g, '.'); // switch , to .
        data = String(data).replace(/[^\d.-]/g, ''); // remove if it's not letters
        return Number(data);
      } catch (err) {
        throw new AppError('Typing : format NUMBER error', { code: 'HELPERS_ERROR', details: err });
      }
    case 'STRING':
      try {
        return String(data);
      } catch (err) {
        throw new AppError('Typing : format STRING error', { code: 'HELPERS_ERROR', details: err });
      }
    case 'HOUR':
      try {
        data = String(data).replace(/h/g, ':');
        data = String(data).replace(/s/g, ':');
        if (param) data = `${_.get(object, param)} ${data}`;
        return moment(new Date(data)).format();
      } catch (err) {
        throw new AppError('Typing : format HOURS error', { code: 'HELPERS_ERROR', details: err });
      }
    default:
      throw new AppError('Typing : format unknown', { code: 'HELPERS_ERROR' });
  }
};

const prepareFormat = (object, schema) => {
  const result = {};
  const keys = objectDeepKeys(object); // get all keys
  keys.forEach((k) => {
    if (!Array.isArray(_.get(object, k))) {
      const p = k.split('.');
      let func = '';
      if (/^\d+$/.test(p[p.length - 1])) func = _.get(schema, p.slice(0, -1).join('.'))[0];
      else func = _.get(schema, p.join('.'));
      _.set(result, k, format(_.get(object, k), func, object));
    }
  });
  return result;
};


exports.typing = (json, schema) => {
  if (Array.isArray(json) && Array.isArray(schema)) {
    return json.map((j) => prepareFormat(j, schema[0]));
  } if (typeof example === 'object' && typeof data === 'object') {
    return prepareFormat(json, schema);
  }
  throw new AppError('Typing : Typing & scrap data return aren\'t arrays or objects', { code: 'HELPERS_ERROR' });
};
