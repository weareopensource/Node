/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const tricks = require(path.resolve('./lib/helpers/tricks'));

/**
 * @desc Function to map object to a schema
 * @param {object} s - schema
 * @param {object} o - object source
 * @return {object} object mapped to new schema
 */
const format = (s, o) => {
  const result = {};

  // in case of array generate other items
  const setArrayItems = (s, o, key, result) => {
    result[key] = []; // init array in result
    const _tv = _.get(o, key); // get arr in object
    result[key].push(format(s[key][0], o)); // add first item
    // generate other items
    if (_tv.length > 1) {
      _tv.forEach((v, i) => {
        // generate & push object with mass path replacement
        if (i > 0) result[key].push(format(tricks.generateObject(s[key][0], `${key}.0`, `${key}.${i}`), o));
      });
    }
  };

  // deep loop
  Object.keys(s).forEach((key) => {
    if (Array.isArray(s[key])) { // array
      setArrayItems(s, o, key, result);
    } else if (typeof s[key] === 'object') { // object
      if (/^\d+$/.test(key)) { // object in array
        result[key] = format(s[key], o);
      } else { // classic object
        result[key] = format(s[key], o);
      }
    } else { // classic value
      result[key] = _.get(o, s[key]);
    }
  });

  // return
  return result;
};

/**
 * @desc mapping
 * @param {object} json - json object or array
 * @param {object} schema - schema to map every objects or object
 * @return {object} new array or object generated based on schema
 */
exports.map = (json, schema) => {
  if (Array.isArray(json) && Array.isArray(schema)) {
    return json.map((j) => {
      const result = format(schema[0], j);
      return result;
    });
  } if (typeof example === 'object' && typeof data === 'object') {
    const result = format(schema, json);
    return result;
  }
  throw new AppError('Typing & scrap data return aren\'t arrays or objects', { code: 'HELPERS_ERROR' });
};
