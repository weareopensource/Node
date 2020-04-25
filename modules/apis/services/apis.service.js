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
const HistorysService = require(path.resolve('./modules/historys/services/historys.service'));
const ApisRepository = require('../repositories/apis.repository');


/**
 * @desc Function to get all api in db
 * @return {Promise} All apis
 */
exports.list = async (user) => {
  const result = await ApisRepository.list(user);
  return Promise.resolve(result);
};

/**
 * @desc Function to get all scrap to cron in db
 * @return {Promise} All scraps
 */
exports.cron = async () => {
  const result = await ApisRepository.cron();
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
  api.path = body.path;
  api.params = body.params;
  api.status = body.status;
  api.banner = body.banner;
  api.description = body.description;
  api.savedb = body.savedb;
  api.autoRequest = body.autoRequest;

  if (body.expiration && body.expiration !== '') api.expiration = body.expiration;
  else api.expiration = null;
  if (body.cron && body.cron !== '') api.cron = body.cron;
  else api.cron = null;
  if (body.alert && body.alert !== '') api.alert = body.alert;
  else api.alert = null;

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
exports.load = async (api, user) => {
  const start = new Date();
  try {
    const result = {};

    // conf
    const params = montaineRequest.setParams(api.params);

    // request
    const request = await montaineRequest.request(api, params);
    result.request = request;
    if (api.path && api.path === '') result.temp = request;
    else result.temp = _.get(request, api.path);

    // Mapping
    if (result.temp && api.mapping && api.mapping !== '') {
      result.temp = montaineMap.map(result.temp, JSON.parse(api.mapping));
      result.mapping = result.temp;
    }

    // Typing
    if (result.temp && api.typing && api.typing !== '') {
      result.temp = montaineType.type(result.temp, JSON.parse(api.typing));
      result.typing = result.temp;
    }
    // prepare for save
    if (result.temp) {
      result.temp = montaineSave.prepare(result.temp, start);
      result.prepare = result.temp;
      result.temp = montaineSave.save(result.temp, start);
      result.mongo = result.temp;
      if (api.savedb) result.result = await ApisRepository.import(api.slug, _.cloneDeep(result.temp));
      delete result.temp;
    }

    // historize
    await HistorysService.historize({ request: result.request, mongo: result.mongo, result: result.result }, start, api, user);

    // return
    return Promise.resolve({
      api,
      result,
    });
  } catch (err) {
    await HistorysService.historize(err, start, api, user);
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
    if (api.path && api.path === '') result.temp = request;
    else result.temp = _.get(request, api.path);


    // Mapping
    if (result.temp && api.mapping && api.mapping !== '') {
      result.temp = montaineMap.map(result.temp, JSON.parse(api.mapping));
    }

    // Typing
    if (result.temp && api.typing && api.typing !== '') {
      result.temp = montaineType.type(result.temp, JSON.parse(api.typing));
    }

    // prepare for save
    if (result.temp) {
      result.temp = montaineSave.prepare(result.temp, start);
      result.temp = montaineSave.save(result.temp, start);
      if (api.savedb) result.result = await ApisRepository.import(api.slug, _.cloneDeep(result.temp));
    }

    // historize
    await HistorysService.historize(_.clone({ request, result }), start, api, 'auto request');
  } catch (err) {
    await HistorysService.historize(err, start, api, 'auto request');
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
    this.workerAuto(api, body);
  } else if (Date.now() - Date.parse(result[0]._updatedAt) > Date.parse(api.expiration)) {
    // check if data but data expired, ask for refresh !
    this.workerAuto(api, body);
    result = [];
  }

  return Promise.resolve(result);
};
