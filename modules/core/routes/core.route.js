/**
 * Module dependencies
 */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));
const core = require('../controllers/core.controller');

/**
 * Routes
 */
module.exports = (app) => {
  // changelogs
  app.route('/api/core/releases').all(policy.isAllowed)
    .get(core.releases);
  // changelogs
  app.route('/api/core/changelogs').all(policy.isAllowed)
    .get(core.changelogs);
};
