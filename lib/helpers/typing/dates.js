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
    else throw new AppError('Typing : DATE');
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
exports.HOUR = (data, params, object) => {
  let date;
  // check time
  let time = {};
  if (params && params.length === 1) {
    if (data.indexOf('h') > -1) time = { hour: data.split('h')[0], minute: data.split('h')[1] || 0, second: 0 };
    if (data.indexOf('H') > -1) time = { hour: data.split('H')[0], minute: data.split('H')[1] || 0, second: 0 };
    if (data.indexOf(':') > -1) time = { hour: data.split(':')[0], minute: data.split(':')[1] || 0, second: data.split(':')[2] || 0 };
    date = moment(_.get(object, params[0]))
      .set('hour', Number(time.hour))
      .set('minute', Number(time.minute))
      .set('second', Number(time.second))
      .format();
  } else date = moment(data).format();
  return date;
};
