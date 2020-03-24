/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const tricks = require(path.resolve('./lib/helpers/tricks'));
const typingDates = require(path.resolve('./lib/helpers/typing/dates'));
const typingTypes = require(path.resolve('./lib/helpers/typing/types'));

/**
 * @desc Function to format data
 * @param {data} data - data to edit
 * @param {string} action - action to do (funxtion style DATE(),  NUMBER() ...)
 * @param {object} object - needed in case of function param
 * @return {data} data - new data generated
 */
const format = (data, action, object) => {
  if (!data) throw new AppError(`Typing : format data not defined : ${data}`, { code: 'HELPERS_ERROR' });
  if (!action) return data;
  if (!object) throw new AppError(`Typing : format object not defined : ${object}`, { code: 'HELPERS_ERROR' });

  const func = action.split('(')[0];
  const params = action.split('(')[1].slice(0, -1).split(',');

  switch (func) {
    case 'DATE':
      try {
        return typingDates.DATE(data);
      } catch (err) {
        throw new AppError('Typing : format DATE error', { code: 'HELPERS_ERROR', details: err });
      }
    case 'DATE_NEXT_DAY':
      try {
        return typingDates.DATE_NEXT_DAY(data);
      } catch (err) {
        throw new AppError('Typing : format DATE_NEXT_DAY error', { code: 'HELPERS_ERROR', details: err });
      }
    case 'NUMBER':
      try {
        return typingTypes.NUMBER(data);
      } catch (err) {
        throw new AppError('Typing : format NUMBER error', { code: 'HELPERS_ERROR', details: err });
      }
    case 'STRING':
      try {
        return typingTypes.STRING(data);
      } catch (err) {
        throw new AppError('Typing : format STRING error', { code: 'HELPERS_ERROR', details: err });
      }
    case 'HOUR':
      try {
        return typingDates.HOUR(data, params, object);
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
  const keys = tricks.objectDeepKeys(object); // get all keys
  keys.forEach((k) => {
    const value = _.get(object, k);
    if (!value || value === '') _.unset(object, k);
    else if (!Array.isArray(value) && typeof value !== 'object') {
      const p = k.split('.');
      let func;
      if (/^\d+$/.test(p[p.length - 1])) { // array
        func = _.get(schema, p.slice(0, -1).join('.'))[0];
      } else if (/^\d+$/.test(p[p.length - 2])) { // object
        p[p.length - 2] = 0;
        func = _.get(schema, p.join('.'));
      } else func = _.get(schema, k);
      _.set(object, k, format(value, func, object));
    }
  });
  return object;
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
