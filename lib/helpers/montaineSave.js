/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const tricks = require(path.resolve('./lib/helpers/tricks'));

/**
 * @desc Function to prepare data for mongo save and historisation, all value became [{updatedAT value }]
 * @param {object} object - object to prepare
 * @param {date} date - date of update
 * @return {object} object - object edited
 */
const prepareSave = (object, date) => {
  const result = {};
  const keys = tricks.objectDeepKeys(object);
  keys.forEach((k) => {
    const value = _.get(object, k);
    if (k.charAt(0) === '@') _.set(result, k, value);
    else if (!Array.isArray(value) && typeof value !== 'object') _.set(result, k, [{ updatedAt: date, value }]);
  });
  return result;
};

/**
 * @desc Function to transform an object in an array of object to blukwrite object in mongo
 * @param {object} object - object to prepare
 * @return {[object]} [object] - array of action for insert in mongoose
 */
const prepareMongoose = (object) => {
  const filter = {};
  const arrays = [];
  const edits = [];
  const keys = tricks.objectDeepKeys(object);
  // ini filter base
  keys.forEach((k) => {
    if (k.charAt(0) === '@') _.set(filter, k, _.get(object, k));
  });
  // set edits
  keys.forEach((k) => {
    const value = _.get(object, k);
    const paths = k.split('.');
    const lastPath = paths[paths.length - 1];
    // if we are abd array or in dend of line
    if (lastPath !== 'value' && lastPath !== 'updatedAt' && Array.isArray(value)) {
      // set base edition
      const edit = {
        filter: _.clone(filter),
        update: {},
      };
      // if we aren't in end of line, but an intermediate array (mongo dot notation create object if null, not array ...)
      if (!value[0].updatedAt) {
        edit.filter[k] = { $exists: false };
        edit.update.$set = {};
        edit.update.$set[`${k}`] = [];
        edit.upsert = false;
        arrays.push(edit);
      } else {
        // if we are in end of line, setup update of value if different
        edit.filter[`${k}.0.value`] = { $ne: value[0].value };
        edit.update.$push = {};
        edit.update.$push[`${k}`] = {};
        edit.update.$push[`${k}`].$each = [value[0]];
        edit.update.$push[`${k}`].$position = -1;
        edit.upsert = false;
        edits.push(edit);
      }
    }
  });

  const init = {
    filter,
    update: {
      $set: filter,
    },
    upsert: true,
  };

  return [init, arrays, edits];
};


/**
 * @desc saving
 */
exports.prepare = (json, date) => {
  if (Array.isArray(json)) {
    return json.map((j) => prepareSave(j, date));
  } if (typeof example === 'object' && typeof data === 'object') {
    return prepareSave(json, date);
  }
  throw new AppError('Saving failed', { code: 'HELPERS_ERROR' });
};

/**
 * @desc saving
 */
exports.save = (json, date) => {
  if (Array.isArray(json)) {
    return _.flattenDeep(json.map((j) => prepareMongoose(j, date)));
  } if (typeof example === 'object' && typeof data === 'object') {
    return prepareMongoose(json, date);
  }
  throw new AppError('Saving failed', { code: 'HELPERS_ERROR' });
};
