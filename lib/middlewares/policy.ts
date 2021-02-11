/**
 * Module dependencies
 */
import { NextFunction, Request, Response } from 'express';
import ACL from 'acl';
import { error } from '../helpers/responses';

/* eslint new-cap: 0 */
export const Acl = new ACL(new ACL.memoryBackend()); // Using the memory backend

export function isAllowed(req: Request & { user: any }, res: Response, next: NextFunction) {
  const roles = (req.user) ? req.user.roles : ['guest'];
  Acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isGood) => {
    if (err) return error(res, 500, 'Server Error', 'Unexpected authorization error')(err);// An authorization error occurred
    if (isGood) return next(); // Access granted! Invoke next middleware

    return error(res, 403, 'Unauthorized', 'User is not authorized')();
  });
}

export function isOwner(req: Request & { user: any, isOwner: boolean }, res: Response, next: NextFunction) {
  if (req.user && req.isOwner && String(req.isOwner) === String(req.user._id)) {
    return next();
  }
  return res.status(403).json({
    message: 'User is not authorized',
  });
}
