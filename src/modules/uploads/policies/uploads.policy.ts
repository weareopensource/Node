/**
 * Module dependencies
* */
import * as policy from '../../../lib/middlewares/policy';

/**
 * Invoke Uploads Permissions
 */
export default function invokeRolesPolicies() {
  policy.Acl.allow([{
    roles: ['user', 'admin'],
    allows: [{
      resources: '/api/uploads/:uploadName',
      permissions: ['get', 'delete'],
    }, {
      resources: '/api/uploads/images/:imageName',
      permissions: ['get'],
    }],
  }]);
}
