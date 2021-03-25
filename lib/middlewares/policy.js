/**
 * Module dependencies
 */
const ACL = require('acl');
const path = require('path');

const responses = require(path.resolve('./lib/helpers/responses'));

/* eslint new-cap: 0 */
module.exports.Acl = new ACL(new ACL.memoryBackend()); // Using the memory backend

/**
 * @desc MiddleWare to check if user is allowed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.isAllowed = (req, res, next) => {
  const roles = req.user ? req.user.roles : ['guest'];
  this.Acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
    if (err) return responses.error(res, 500, 'Server Error', 'Unexpected authorization error')(err); // An authorization error occurred
    if (isAllowed) return next(); // Access granted! Invoke next middleware

    return responses.error(res, 403, 'Unauthorized', 'User is not authorized')();
  });
};

/**
 * @desc MiddleWare to check if user is owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.isOwner = (req, res, next) => {
  if (req.user && req.isOwner && String(req.isOwner) === String(req.user._id)) {
    return next();
  }
  return res.status(403).json({
    message: 'User is not authorized',
  });
};
