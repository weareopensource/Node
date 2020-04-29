/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));
const uploads = require('../controllers/uploads.controller');

/**
 * Routes
 */
module.exports = (app) => {
  // classic crud
  app.route('/api/uploads/:uploadName').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(uploads.get)
    .delete(policy.isOwner, uploads.delete); // delete

  // Finish by binding the task middleware
  app.param('uploadName', uploads.uploadByName);
};
