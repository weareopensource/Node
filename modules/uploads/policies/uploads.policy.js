/**
 * Module dependencies
 * */
import policy from '../../../lib/middlewares/policy.js';

/**
 * Invoke Uploads Permissions
 */
const invokeRolesPolicies = () => {
  policy.Acl.allow([
    {
      roles: ['user', 'admin'],
      allows: [
        {
          resources: '/api/uploads/:uploadName',
          permissions: ['get', 'delete'],
        },
        {
          resources: '/api/uploads/images/:imageName',
          permissions: ['get'],
        },
      ],
    },
  ]);
};

export default {
  invokeRolesPolicies,
};
