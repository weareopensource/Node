/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const policy = require(path.resolve('./lib/middlewares/policy'));
const apis = require('../controllers/apis.controller');
const apisSchema = require('../models/apis.schema');

/**
 * Routes
 */
module.exports = (app) => {
  // list & post
  app.route('/api/apis')
    .get(apis.list) // list
    .post(passport.authenticate('jwt'), policy.isAllowed, model.isValid(apisSchema.Api), apis.create); // create

  // classic crud
  app.route('/api/apis/:apiId').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(apis.get) // get
    .put(model.isValid(apisSchema.Api), apis.update) // update
    .delete(model.isValid(apisSchema.Api), apis.delete); // delete

  app.route('/api/apis/load/:apiId')
    .get(apis.load);

  app.route('/api/apis/data/:apiId')
    .get(apis.listApi)
    .post(apis.getApi);

  app.route('/api/apis/aggregate/:apiId')
    .post(apis.getAggregateApi);

  // Finish by binding the api middleware
  app.param('apiId', apis.apiByID);
};
