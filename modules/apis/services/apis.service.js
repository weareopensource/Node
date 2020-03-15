/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const UserService = require(path.resolve('./modules/users/services/user.service.js'));
const montaineMapping = require(path.resolve('./lib/helpers/montaineMapping'));
const montaineTyping = require(path.resolve('./lib/helpers/montaineTyping'));
const montaineRequest = require(path.resolve('./lib/helpers/montaineRequest'));
const montaineSaving = require(path.resolve('./lib/helpers/montaineSaving'));
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
  api.url = body.url;
  api.auth = body.auth;
  api.serviceId = body.serviceId;
  api.params = body.params;
  api.status = body.status;
  api.banner = body.banner;
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
 * @desc Functio to ask repository to load an api request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.load = async (api) => {
  const start = new Date();
  const result = {};
  // conf
  const params = montaineRequest.setParams(api.params);
  // request
  const request = await montaineRequest.request(api, params);
  result.request = request;
  result.result = request.data;
  // Mapping
  if (result.result && api.mapping && api.mapping !== '') {
    result.mapping = montaineMapping.mapping(result.result, JSON.parse(api.mapping));
    result.result = result.mapping;
    if (!result.mapping) {
      result.type = 'error';
      result.message = 'Failed data Mapping';
    }
  }
  // Typing
  if (result.result && result.request.type === 'success' && api.typing && api.typing !== '') {
    result.typing = montaineTyping.typing(result.result, JSON.parse(api.typing));
    result.result = result.typing;
    if (!result.typing) {
      result.type = 'error';
      result.message = 'Failed data Typing';
    }
  }
  // prepare for save
  if (result.result) {
    result.result = montaineSaving.saving(result.result, start);
    await ApisRepository.import(_.camelCase(api.title), result.result, ['@id', '@date']);
  }

  const history = await HistoryRepository.create(montaineRequest.setScrapHistory(result.request, api, start));
  api.status = result.request.type === 'success';
  api.history.push(history._id);
  api = await ApisRepository.update(api);
  // return
  return Promise.resolve({
    api,
    result,
  });
};
