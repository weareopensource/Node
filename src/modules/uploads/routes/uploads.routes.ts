/**
 * Module dependencies
 */
import passport from 'passport';

import * as policy from '../../../lib/middlewares/policy';
import * as uploads from '../controllers/uploads.controller';

/**
 * Routes
 */
export default (app) => {
  // classic crud
  app.route('/api/uploads/:uploadName').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(uploads.get)
    .delete(policy.isOwner, uploads.deleteUpload); // delete

  // classic crud
  app.route('/api/uploads/images/:imageName').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(uploads.getSharp);

  // Finish by binding the task middleware
  app.param('uploadName', uploads.uploadByName);
  app.param('imageName', uploads.uploadByImageName);
};
