const moment = require('moment');
const _ = require('lodash');
const path = require('path');

const AppError = require(path.resolve('./lib/helpers/AppError'));

/**
 * @desc _DATE
 */
exports.DATE = (data) => {
  let date = moment(data).format();
  // fixs
  if (date === 'Invalid date') {
    const dateSplit = data.split('-');
    if (dateSplit.length === 3) date = moment(`${dateSplit[0]}-${dateSplit[1]}`).add(Number(dateSplit[2]) - 1, 'days').format(); // Hot Fix if date containe more dats than a month
    else throw new AppError(`Typing : date invalid ${data}`, { code: 'HELPERS_ERROR', details: date });
  }
  return date;
};

/**
   * @desc _DATE_NEXT_DAY
   */
exports.DATE_NEXT_DAY = (data) => {
  let date;
  const target = Number(data);
  const today = Number(moment().date());
  if (target >= today) date = moment().add(target - today, 'days').format();
  else date = moment().add(1, 'months').subtract(today - target, 'days').format();
  return date;
};

/**
   * @desc HOUR
   */
exports.HOUR = (data, param, object) => {
  if (param) {
    return moment(_.get(object, param)).set('hour', Number(data)).format();
  }
  return moment(_.get(object, param)).format();
};
