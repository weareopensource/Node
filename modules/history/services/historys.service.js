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
  const history = await HistorysRepository.create(montaineRequest.setApiHistory(result, start, user));
  await HistorysRepository.apiHistorize(api, history);
  api.history.push(history);
  return Promise.resolve(api);
};
