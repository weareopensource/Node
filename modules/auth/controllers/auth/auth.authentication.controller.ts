/**
 * Module dependencies
 */
import { Response } from 'express';
import path from 'path';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { NodeRequest } from '../../../../lib/helpers/responses';
import { checkError, getResultFromJoi } from '../../../../lib/middlewares/model';

const UserService = require(path.resolve(
  'modules/users/services/user.service',
));
const config = require(path.resolve('./config'));
const UsersSchema = require(path.resolve('./modules/users/models/user.schema'));

export async function checkOAuthUserProfile(profil: any, key: string, provider: any, res: Response) {
  // check if user exist
  try {
    const query = { provider: undefined };
    query[`providerData.${key}`] = profil.providerData[key];
    query.provider = provider;
    const search = await UserService.search(query);
    if (search.length === 1) return search[0];
  } catch (err) {
    throw new AppError('oAuth, find user failed', { code: 'SERVICE_ERROR', details: err });
  }
  // if no, generate
  try {
    const user = {
      firstName: profil.firstName,
      lastName: profil.lastName,
      email: profil.email,
      avatar: profil.avatar || '',
      provider,
      providerData: profil.providerData || null,
    };
    const result = getResultFromJoi(user, UsersSchema.User, _.clone(config.joi.validationOptions));
    // check error
    const error = checkError(result);
    if (error) return responses.error(res, 422, 'Schema validation error', error)(result.error);
    // else return req.body with the data after Joi validation
    return UserService.create(result.value);
  } catch (err) {
    throw new AppError('oAuth', { code: 'CONTROLLER_ERROR', details: err.details || err });
  }
}

/**
 * @desc Endpoint to ask the service to create a user
 */
export async function signup(req: NodeRequest, res: Response) {
  try {
    if (!config.sign.up) {
      return responses.error(res, 404, 'Error', 'Sign Up actually disabled')();
    }
    const user = await UserService.create(req.body);
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
    return res
      .status(200)
      .cookie('TOKEN', token, { httpOnly: true })
      .json({
        user,
        tokenExpiresIn: Date.now() + config.jwt.expiresIn * 1000,
        type: 'sucess',
        message: 'Sign up',
      });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to connect a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function signin(req: NodeRequest, res: Response) {
  if (!config.sign.in) {
    return responses.error(res, 404, 'Error', 'Sign In actually disabled')();
  }
  const user = req.user;
  const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  return res
    .status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({
      user,
      tokenExpiresIn: Date.now() + config.jwt.expiresIn * 1000,
      type: 'sucess',
      message: 'Sign in',
    });
}

/**
 * @desc Endpoint to get a new token if old is ok
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function buildToken(req: NodeRequest, res: Response) {
  let user;
  if (req.user) {
    user = {
      id: req.user.id,
      provider: escape(req.user.provider),
      roles: req.user.roles,
      avatar: req.user.avatar,
      email: escape(req.user.email),
      lastName: escape(req.user.lastName),
      firstName: escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData,
    };
  }
  const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  return res
    .status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({ user, tokenExpiresIn: Date.now() + config.jwt.expiresIn * 1000 });
}

/**
 * @desc Endpoint for oautCall
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function oauthCall(req, res, next) {
  const strategy = req.params.strategy;
  passport.authenticate(strategy)(req, res, next);
}

/**
 * @desc Endpoint for oautCallCallBack
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function oauthCallback(req, res, next) {
  const strategy = req.params.strategy;
  // app Auth with Strategy managed on client side
  if (req.body.strategy === false && req.body.key) {
    try {
      let user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        providerData: {},
      };
      user.providerData[req.body.key] = req.body.value;
      user = await checkOAuthUserProfile(user, req.body.key, strategy, res);
      // @ts-ignore
      const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });
      return res
        .status(200)
        .cookie('TOKEN', token, { httpOnly: true })
        .json({
          user, tokenExpiresIn: Date.now() + config.jwt.expiresIn * 1000, type: 'sucess', message: 'oAuth Ok',
        });
    } catch (err) {
      return responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err.details || err))(err);
    }
  }
  // classic web oAuth
  passport.authenticate(strategy, (err, user) => {
    const url = config.cors.origin[0];

    if (err) {
      res.redirect(302, `${url}/token?message=Unprocessable%20Entity&error=${JSON.stringify(err)}`);
    } else if (!user) {
      res.redirect(302, `${url}/token?message=Could%20not%20define%20user%20in%20oAuth&error=${JSON.stringify(err)}`);
    } else {
      const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      res.cookie('TOKEN', token, { httpOnly: true });
      res.redirect(302, `${config.cors.origin[0]}/token`);
    }
  })(req, res, next);
}
