/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const policy = require(path.resolve('./lib/middlewares/policy'));
const historys = require('../controllers/historys.controller');
const historysSchema = require('../models/historys.schema');

/**
 * Routes
 */
module.exports = (app) => {
  // list & post
  app.route('/api/historys').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(historys.list); // list

  // classic crud
  app.route('/api/historys/:historyId').all(passport.authenticate('jwt'), policy.isAllowed) // policy.isOwner available
    .get(historys.get); // get

  // Finish by binding the historys middleware
  app.param('historyId', historys.historyByID);
};
