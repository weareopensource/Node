/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');
const Joi = require('joi');

const AppError = require(path.resolve('./lib/helpers/AppError'));
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
exports.list = async (user) => {
  const result = await ApisRepository.list(user);
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
  api.serviceKey = body.serviceKey;
  api.params = body.params;
  api.status = body.status;
  api.banner = body.banner;
  api.description = body.description;
  api.savedb = body.savedb;
  api.autoRequest = body.autoRequest;
  if (body.expiration && body.expiration !== '') api.expiration = body.expiration;
  else api.expiration = null;
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
exports.historize = async (result, start, api) => {
  const history = await HistoryRepository.create(montaineRequest.setApiHistory(result, start));
  await ApisRepository.historize(api, history);
  api.history.push(history);
  return Promise.resolve(api);
};

/**
 * @desc Functio to ask repository to load an api request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.load = async (api) => {
  const start = new Date();
  try {
    const result = {};

    // conf
    const params = montaineRequest.setParams(api.params);

    // request
    const request = await montaineRequest.request(api, params);
    result.request = request;
    result.result = request.data.result;

    // Mapping
    if (result.result && api.mapping && api.mapping !== '') {
      result.result = montaineMap.map(result.result, JSON.parse(api.mapping));
      result.mapping = result.result[0] ? result.result[0] : result.result;
    }

    // Typing
    if (result.result && api.typing && api.typing !== '') {
      result.result = montaineType.type(result.result, JSON.parse(api.typing));
      result.typing = result.result[0] ? result.result[0] : result.result;
    }
    // prepare for save
    if (result.result) {
      result.result = montaineSave.prepare(result.result, start);
      result.prepare = result.result[0] ? result.result[0] : result.result;
      result.result = montaineSave.save(result.result, start);
      result.mongo = result.result;
      if (api.savedb) result.result = await ApisRepository.import(api.slug, _.cloneDeep(result.result));
    }

    // historize
    await this.historize({ request: result.request, mongo: result.mongo, result: result.result }, start, api);

    // return
    return Promise.resolve({
      api,
      result,
    });
  } catch (err) {
    await this.historize(err, start, api);
    return Promise.resolve({ err, api });
  }
};

/**
 * @desc Functio to ask repository to load an api request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.workerAuto = async (api, body) => {
  const start = new Date();
  try {
    const result = {};

    // generate params
    const params = {};
    body.forEach((el) => {
      if (el.$match) {
        Object.keys(api.params).forEach((key) => {
          params[key] = el.$match[key];
        });
      }
    });

    // dynamic schema test on params
    const schema = {};
    Object.keys(api.params).forEach((key) => {
      schema[key] = Joi.string().trim().required();
    });
    const paramsSchema = Joi.object().keys(schema);
    const testedSchema = montaineRequest.isValidDynamicSchema(paramsSchema, params);
    if (testedSchema.error) throw new AppError('Schema validation error', { code: 'SERVICE_ERROR', details: testedSchema.error });


    // request
    const request = await montaineRequest.request(api, params);
    result.result = request.data.result;

    // Mapping
    if (result.result && api.mapping && api.mapping !== '') {
      result.result = montaineMap.map(result.result, JSON.parse(api.mapping));
    }

    // Typing
    if (result.result && api.typing && api.typing !== '') {
      result.result = montaineType.type(result.result, JSON.parse(api.typing));
    }

    // prepare for save
    if (result.result) {
      result.result = montaineSave.prepare(result.result, start);
      result.result = montaineSave.save(result.result, start);
      if (api.savedb) result.result = await ApisRepository.import(api.slug, _.cloneDeep(result.result));
    }

    // historize
    await this.historize(_.clone({ request, result }), start, api);
  } catch (err) {
    await this.historize(err, start, api);
    return Promise.resolve({ err, api });
  }
};


/**
 * @desc Functio to ask repository to get data stocker from apis request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.listApi = async (api) => {
  const result = await ApisRepository.listApi(api.slug);
  return Promise.resolve(result);
};

/**
 * @desc Functio to ask repository to get data stocker from apis request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.getApi = async (api, body) => {
  const result = await ApisRepository.getApi(api.slug, body);
  return Promise.resolve(result);
};

/**
 * @desc Functio to ask repository to get data Aggregated saved from apis request
 * @param {Object} scrap - original scrap
 * @return {Promise} scrap
 */
exports.getAggregateApi = async (api, body) => {
  let result = await ApisRepository.getAggregateApi(api.slug, body);

  if (result.length === 0 && api.autoRequest) {
    // check if no data return, then we probably have no data :) ask for it !
    this.workerAuto(api, body, new Date());
  } else if (Date.now() - Date.parse(result[0]._updatedAt) > Date.parse(api.expiration)) {
    // check if data but data expired, ask for refresh !
    this.workerAuto(api, body, new Date());
    result = [];
  }

  return Promise.resolve(result);
};
