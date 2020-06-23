const path = require('path');
const _ = require('lodash');

const AppError = require(path.resolve('./lib/helpers/AppError'));

/**
   * @desc STRING_MAP_TO_STRING
   */
exports.STRING_MAP_TO_STRING = (data, params) => {
  const choices = params.map((value) => value.split('=')[0]);
  const find = choices.indexOf(data);
  if (find > -1) return String(params[find].split('=')[1]);
  throw new AppError('Typing : STRING_MAP_TO_STRING');
};

/**
   * @desc STRING_MAP_TO_STRING_CAMEL
   */
exports.STRING_MAP_TO_STRING_CAMEL = (data, params) => {
  const choices = params.map((value) => _.camelCase(value.split('=')[0]));
  const find = choices.indexOf(_.camelCase(data));
  if (find > -1) return String(params[find].split('=')[1]);
  throw new AppError('Typing : STRING_MAP_TO_STRING_CAMEL');
};

/**
   * @desc STRING_MAP_TO_NUMBER
   */
exports.STRING_MAP_TO_NUMBER = (data, params) => {
  const choices = params.map((value) => value.split('=')[0]);
  const find = choices.indexOf(data);
  if (find > -1) return Number(params[find].split('=')[1]);
  throw new AppError('Typing : STRING_MAP_TO_NUMBER');
};

/**
     * @desc STRING_MAP_TO_NUMBER_CAMEL
     */
exports.STRING_MAP_TO_NUMBER_CAMEL = (data, params) => {
  const choices = params.map((value) => _.camelCase(value.split('=')[0]));
  const find = choices.indexOf(_.camelCase(data));
  if (find > -1) return Number(params[find].split('=')[1]);
  throw new AppError('Typing : STRING_MAP_TO_NUMBER_CAMEL');
};
