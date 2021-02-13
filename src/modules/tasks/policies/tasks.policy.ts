/**
 * Module dependencies
* */
import * as policy from '../../../lib/middlewares/policy';

/**
 * Invoke Tasks Permissions
 */
export default function invokeRolesPolicies() {
  policy.Acl.allow([{
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
      resources: '/api/tasks/stats',
      permissions: ['get'],
    }, {
      resources: '/api/tasks',
      permissions: ['get'],
    }, {
      resources: '/api/tasks/:taskId',
      permissions: ['get'],
    }],
  }]);
}
