/**
 * Module dependencies
 */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));
const home = require('../controllers/home.controller');

/**
 * Routes
 */
module.exports = (app) => {
  // changelogs
  app.route('/api/home/releases').all(policy.isAllowed).get(home.releases);
  // changelogs
  app.route('/api/home/changelogs').all(policy.isAllowed).get(home.changelogs);
  // changelogs
  app.route('/api/home/team').all(policy.isAllowed).get(home.team);
  // markdown files
  app.route('/api/home/pages/:name').all(policy.isAllowed).get(home.page);

  // Finish by binding the task middleware
  app.param('name', home.pageByName);
};
