/**
 * Module dependencies
 */
let acl = require('acl');
// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Tasks Permissions
 */
exports.invokeRolesPolicies = () => {
  acl.allow([{
    roles: ['user'],
    allows: [{
      resources: '/api/tasks',
      permissions: '*'
    }, {
      resources: '/api/tasks/me',
      permissions: ['get']
    }, {
      resources: '/api/tasks/:taskId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/tasks',
      permissions: ['get']
    }, {
      resources: '/api/tasks/:taskId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Tasks Policy Allows
 */
exports.isAllowed = (req, res, next) => {
  const roles = (req.user) ? req.user.roles : ['guest'];

  // If an task is being processed and the current user created it then allow any manipulation
  if (req.task && req.user && req.task.user && req.task.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
