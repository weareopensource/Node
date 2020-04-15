/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const tricks = require(path.resolve('./lib/helpers/tricks'));
const typingDates = require(path.resolve('./lib/helpers/typing/dates'));
const typingNumbers = require(path.resolve('./lib/helpers/typing/numbers'));
const typingStrings = require(path.resolve('./lib/helpers/typing/strings'));
const typingMap = require(path.resolve('./lib/helpers/typing/map'));

/**
 * @desc Function to format data
 * @param {data} data - data to edit
 * @param {string} action - action to do (funxtion style DATE(),  NUMBER() ...)
 * @param {object} object - needed in case of function param
 * @return {data} data - new data generated
 */
const convert = (data, action, object) => {
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
        throw new AppError(`Typing : format DATE error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'DATE_NEXT_DAY':
      try {
        return typingDates.DATE_NEXT_DAY(data);
      } catch (err) {
        throw new AppError(`Typing : format DATE_NEXT_DAY error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'HOUR':
      try {
        return typingDates.HOUR(data, params, object);
      } catch (err) {
        throw new AppError(`Typing : format HOURS error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'NUMBER':
      try {
        return typingNumbers.NUMBER(data);
      } catch (err) {
        throw new AppError(`Typing : format NUMBER error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'STRING':
      try {
        return typingStrings.STRING(data);
      } catch (err) {
        throw new AppError(`Typing : format STRING error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'SLUG':
      try {
        return typingStrings.SLUG(data);
      } catch (err) {
        throw new AppError(`Typing : format SLUG error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'STRING_MAP_TO_STRING':
      try {
        return typingMap.STRING_MAP_TO_STRING(data, params);
      } catch (err) {
        throw new AppError(`Typing : format STRING_MAP_TO_STRING error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'STRING_MAP_TO_STRING_CAMEL':
      try {
        return typingMap.STRING_MAP_TO_STRING_CAMEL(data, params);
      } catch (err) {
        throw new AppError(`Typing : format STRING_MAP_TO_STRING_CAMEL error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'STRING_MAP_TO_NUMBER':
      try {
        return typingMap.STRING_MAP_TO_NUMBER(data, params);
      } catch (err) {
        throw new AppError(`Typing : format STRING_MAP_TO_NUMBER error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    case 'STRING_MAP_TO_NUMBER_CAMEL':
      try {
        return typingMap.STRING_MAP_TO_NUMBER_CAMEL(data, params);
      } catch (err) {
        throw new AppError(`Typing : format STRING_MAP_TO_NUMBER_CAMEL error on ${data}`, { code: 'HELPERS_ERROR', details: { data, params } });
      }
    default:
      throw new AppError('Typing : format unknown', { code: 'HELPERS_ERROR' });
  }
};

/**
 * @desc Function to type data in an object based on a schema
 * @param {object} object - object to edit
 * @param {object} schema - schema with instructions
 * @return {object} object - object transformed
 */
const format = (object, schema) => {
  const keys = tricks.objectDeepKeys(object);
  keys.forEach((p) => {
    const v = _.get(object, p); // value
    if (!v || v === '') _.unset(object, p); // unset null or empty
    else if (!Array.isArray(v) && typeof v !== 'object') { // filter arrays & objects
      const formated = convert(v, _.get(schema, p.replace(/\d/g, '0')), object);
      _.set(object, p, formated);
    }
  });
  return object;
};

/**
 * @desc typing
 */
exports.type = (json, schema) => {
  if (Array.isArray(json) && Array.isArray(schema)) {
    return json.map((j) => format(j, schema[0]));
  } if (typeof example === 'object' && typeof data === 'object') {
    return format(json, schema);
  }
  throw new AppError('Typing : Typing & scrap data return aren\'t arrays or objects', { code: 'HELPERS_ERROR' });
};
