/**
 * Module dependencies
 */
const moment = require('moment');
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const tricks = require(path.resolve('./lib/helpers/tricks'));

/**
 * @desc Function to format data
 * @param {data} data - data to edit
 * @param {string} action - action to do (funxtion style DATE(),  NUMBER() ...)
 * @param {object} object - needed in case of function param
 * @return {data} data - new data generated
 */
const format = (data, action, object) => {
  if (!data) throw new AppError('Typing : format data not defined.', { code: 'HELPERS_ERROR' });
  if (!action) throw new AppError('Typing : format action not defined.', { code: 'HELPERS_ERROR' });
  if (!object) throw new AppError('Typing : format object not defined.', { code: 'HELPERS_ERROR' });

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

/**
 * @desc Function to format data in and object based on a schema
 * @param {object} object - object to edit
 * @param {object} schema - schema with instructions
 * @return {object} object - new object generated
 */
const prepareFormat = (object, schema) => {
  const result = {};
  const keys = tricks.objectDeepKeys(object); // get all keys
  keys.forEach((k) => {
    const value = _.get(object, k);
    if (!Array.isArray(value) && typeof value !== 'object') {
      const p = k.split('.');
      let func = '';
      if (/^\d+$/.test(p[p.length - 1])) { // array
        func = _.get(schema, p.slice(0, -1).join('.'))[0];
      } else if (/^\d+$/.test(p[p.length - 2])) { // object
        p[p.length - 2] = 0;
        func = _.get(schema, p.join('.'));
      } else func = _.get(schema, k);
      _.set(result, k, format(value, func, object));
    }
  });
  return result;
};

/**
 * @desc typing
 */
exports.type = (json, schema) => {
  if (Array.isArray(json) && Array.isArray(schema)) {
    return json.map((j) => prepareFormat(j, schema[0]));
  } if (typeof example === 'object' && typeof data === 'object') {
    return prepareFormat(json, schema);
  }
  throw new AppError('Typing : Typing & scrap data return aren\'t arrays or objects', { code: 'HELPERS_ERROR' });
};
