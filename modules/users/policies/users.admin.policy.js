/**
 * Module dependencies
 * */
import policy from '../../../lib/middlewares/policy.js';

/**
 * Invoke Tasks Permissions
 */
const invokeRolesPolicies = () => {
  policy.Acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/users',
          permissions: ['get'],
        },
        {
          resources: '/api/users/page/:userPage',
          permissions: ['get'],
        },
        {
          resources: '/api/users/:userId',
          permissions: ['get', 'put', 'delete'],
        },
      ],
    },
  ]);
};

export default {
  invokeRolesPolicies,
};
