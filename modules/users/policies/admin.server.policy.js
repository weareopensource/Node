/**
 * Module dependencies
 */
const ACL = require('acl');

// Using the memory backend
/* eslint new-cap: 0 */
const Acl = new ACL(new ACL.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = () => {
  Acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*',
    }, {
      resources: '/api/users/:userId',
      permissions: '*',
    }],
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = ({
  user, route, method, body,
}, res, next) => {
  const roles = (user) ? user.roles : ['guest'];

  // Check for user roles
  Acl.areAnyRolesAllowed(roles, route.path, method.toLowerCase(), (err, isAllowed) => {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    } if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    }
    if (user.id === body.id) {
      return next();
    }
    return res.status(403).json({
      message: 'User is not authorized',
    });
  });
};
