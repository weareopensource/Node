/**
 * Module dependencies
 */
const path = require('path');

const montaineRequest = require(path.resolve('./lib/helpers/montaineRequest'));
const HistorysRepository = require('../repositories/historys.repository');

/**
 * @desc Function to get all history in db
 * @return {Promise} All historys
 */
exports.list = async (user) => {
  const result = await HistorysRepository.list(user);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get an history
 * @param {String} id
 * @return {Promise} task
 */
exports.get = async (id) => {
  const result = await HistorysRepository.get(id);
  return Promise.resolve(result);
};


/**
 * @desc Functio to ask repository to add an history
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.historize = async (result, start, api, user) => {
  try {
    const history = await HistorysRepository.create(montaineRequest.setHistory(result, start, api, user));
    await HistorysRepository.apiHistorize(api, history);
    api.history.push(history);
    if (!history.status) await montaineRequest.sendMailAlert(result, api, history);
    return Promise.resolve(api);
  } catch (err) {
    console.log(err);
  }
};
