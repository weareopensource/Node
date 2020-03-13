/**
 * Module dependencies
 */
const axios = require('axios');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const path = require('path');

const config = require(path.resolve('./config'));
const AppError = require(path.resolve('./lib/helpers/AppError'));


/**
 * @desc generate default params
 * @param {Object} p - params
 * @return {Object} result - params generated
 */
exports.setParams = (p) => {
  const result = {};
  if (p && p.length !== 0) {
    Object.keys(p).forEach((key) => {
      if (String(p[key]).split('@')[0] === 'Date') result[key] = moment().add(Number(String(p[key]).split('@')[1]), 'days').format(String(p[key]).split('@')[2]);
      else result[key] = p[key];
    });
  }
  return result;
};

/**
 * @desc request
 * @param {String} r - request
 * @return {} result
 */
exports.request = async (api, params) => {
  try {
    const token = jwt.sign({ userId: api.serviceId }, config.jwtLou.secret, { expiresIn: config.jwtLou.expiresIn });

    const res = await axios({
      method: 'POST',
      url: api.url,
      headers: {
        Cookie: `TOKEN=${token}`,
      },
      data: params,
    });
    if (api.auth === 'lou' && res.data) return res.data;
    return res;
  } catch (err) {
    if (err.response && err.response.data) return err.response;
    throw new AppError(`Distant server (${api.url}) not reachable.`, { code: 'HELPERS_ERROR', details: err });
  }
};


/**
 * @desc setScrapHistory
 * @param {Object} data - scraping result
 * @return {Object} mail status
 */
exports.setScrapHistory = (result, api, start) => ({
  status: result.type === 'success',
  apiId: api.id,
  result: {
    type: result.type || null,
    message: result.message || null,
  },
  ip: result.ip || null,
  time: new Date() - start,
});
