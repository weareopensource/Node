/**
 * Module dependencies
 */
const ACL = require('acl');

// Using the memory backend
/* eslint new-cap: 0 */
const Acl = new ACL(new ACL.memoryBackend());

/**
 * Invoke Tasks Permissions
 */
exports.invokeRolesPolicies = () => {
  Acl.allow([{
    roles: ['user'],
    allows: [{
      resources: '/api/tasks',
      permissions: '*',
    }, {
      resources: '/api/tasks/:taskId',
      permissions: '*',
    }],
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/tasks',
      permissions: ['get'],
    }, {
      resources: '/api/tasks/:taskId',
      permissions: ['get'],
    }],
  }]);
};

/**
 * @desc MiddleWare to check if user is allowed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.isAllowed = (req, res, next) => {
  const roles = (req.user) ? req.user.roles : ['guest'];

  // If an task is being processed and the current user created it then allow any manipulation
  if (req.task && req.user && req.task.user && req.task.user.id === req.user.id) next();
  else {
    // Check for user roles
    Acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
      if (err) return res.status(500).send('Unexpected authorization error'); // An authorization error occurred
      if (isAllowed) return next(); // Access granted! Invoke next middleware

      return res.status(403).json({ message: 'User is not authorized' });
    });
  }
};
