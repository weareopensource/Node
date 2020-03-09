/**
 * Module dependencies
 */
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');

const config = require(path.resolve('./config'));


/**
 * @desc request
 * @param {String} r - request
 * @return {} result
 */
exports.request = async (api) => {
  try {
    const token = jwt.sign({ userId: api.serviceId }, config.jwtLou.secret, { expiresIn: config.jwtLou.expiresIn });

    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3010/api/scraps/worker/5e567f72778ecf488ce269f9',
      headers: {
        Cookie: `TOKEN=${token}`,
      },
      data: {},
    });
    return res;
  } catch (err) {
    return err.response.data;
  }
};
