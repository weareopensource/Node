/**
 * Module dependencies
 */
const path = require('path');

const UserService = require(path.resolve('./modules/users/services/user.service.js'));
const montaine = require(path.resolve('./lib/helpers/montaine'));
const ApisRepository = require('../repositories/apis.repository');


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
  api.status = body.status;
  api.banner = body.banner;
  api.description = body.description;
  api.password = await UserService.hashPassword(api.password);

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
  console.log('load');
  const result = await montaine.request(api);
  console.log('result', result.data);
  // return
  return Promise.resolve(result.data);
};
