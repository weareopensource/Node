/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const UserService = require(path.resolve('./modules/users/services/user.service.js'));
const montaineMap = require(path.resolve('./lib/helpers/montaineMap'));
const montaineType = require(path.resolve('./lib/helpers/montaineType'));
const montaineRequest = require(path.resolve('./lib/helpers/montaineRequest'));
const montaineSave = require(path.resolve('./lib/helpers/montaineSave'));
const ApisRepository = require('../repositories/apis.repository');
const HistoryRepository = require('../repositories/history.repository');


/**
 * @desc Function to get all api in db
 * @return {Promise} All apis
 */
exports.list = async () => {
  const result = await ApisRepository.list();
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to create a api
 * @param {Object} api
 * @return {Promise} api
 */
exports.create = async (api, user) => {
  api.user = user.id;
  api.slug = _.camelCase(api.title);
  if (api.password) api.password = await UserService.hashPassword(api.password);
  const result = await ApisRepository.create(api);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get a api
 * @param {String} id
 * @return {Promise} api
 */
exports.get = async (id) => {
  const result = await ApisRepository.get(id);
  return Promise.resolve(result);
};

/**
 * @desc Functio to ask repository to update a api
 * @param {Object} api - original api
 * @param {Object} body - api edited
 * @return {Promise} api
 */
exports.update = async (api, body) => {
  api.title = body.title;
  api.slug = _.camelCase(body.title);
  api.url = body.url;
  api.auth = body.auth;
  api.serviceId = body.serviceId;
  api.params = body.params;
  api.status = body.status;
  api.banner = body.banner;
  api.savedb = body.savedb;
  api.description = body.description;
  if (body.typing && body.typing !== '') api.typing = body.typing;
  else api.typing = null;
  if (body.mapping && body.mapping !== '') api.mapping = body.mapping;
  else api.mapping = null;

  const result = await ApisRepository.update(api);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete a api
 * @param {Object} api
 * @return {Promise} confirmation of delete
 */
exports.delete = async (api) => {
  const result = await ApisRepository.delete(api);
  return Promise.resolve(result);
};


/**
 * @desc Functio to ask repository to add an history
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.historize = async (status, err, start, api) => {
  const history = await HistoryRepository.create(montaineRequest.setApiHistory(status, err, start));
  api.history.push(history._id);
  api.status = history.status;
  api = await ApisRepository.update(api);
  return Promise.resolve(api);
};

/**
 * @desc Functio to ask repository to load an api request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.load = async (api, start) => {
  const result = {};
  // conf
  const params = montaineRequest.setParams(api.params);
  // request
  const request = await montaineRequest.request(api, params);
  result.request = request;
  result.result = request.data.result;
  // Mapping
  if (result.result && api.mapping && api.mapping !== '') {
    result.result = montaineMap.map(_.cloneDeep(result.result), JSON.parse(api.mapping));
    result.mapping = result.result[0] ? result.result[0] : result.result;
  }

  // Typing
  if (result.result && api.typing && api.typing !== '') {
    result.result = montaineType.type(_.cloneDeep(result.result), JSON.parse(api.typing));
    result.typing = result.result[0] ? result.result[0] : result.result;
  }
  // prepare for save
  if (result.result) {
    result.result = montaineSave.prepare(_.cloneDeep(result.result), start);
    result.prepare = result.result[0] ? result.result[0] : result.result;
    result.result = montaineSave.save(_.cloneDeep(result.result), start);
    result.mongo = result.result;
    if (api.savedb) result.result = await ApisRepository.import(api.slug, result.result);
  }

  // return
  return Promise.resolve({
    api,
    result,
  });
};


/**
 * @desc Functio to ask repository to get data stocker from apis request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.getApiData = async (api) => {
  const result = await ApisRepository.getApiData(api.slug);
  return Promise.resolve(result);
};
