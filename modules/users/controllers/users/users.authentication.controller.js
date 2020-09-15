/**
 * Module dependencies
 */
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const config = require(path.resolve('./config'));
const model = require(path.resolve('./lib/middlewares/model'));
const responses = require(path.resolve('./lib/helpers/responses'));
const errors = require(path.resolve('./lib/helpers/errors'));
const AppError = require(path.resolve('./lib/helpers/AppError'));
const UserService = require('../../services/user.service');
const UsersSchema = require('../../models/user.schema');

/**
 * @desc Endpoint to ask the service to create a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.signup = async (req, res) => {
  try {
    const user = await UserService.create(req.body);
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    return res.status(200)
      .cookie('TOKEN', token, { httpOnly: true })
      .json({
        user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000), type: 'sucess', message: 'Sign up',
      });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to connect a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.signin = async (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  return res.status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({
      user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000), type: 'sucess', message: 'Sign in',
    });
};

/**
 * @desc Endpoint to get a new token if old is ok
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.token = async (req, res) => {
  let user = null;
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
  const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  return res.status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({ user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000) });
};

/**
 * @desc Endpoint for oautCall
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.oauthCall = (req, res, next) => {
  const strategy = req.params.strategy;
  passport.authenticate(strategy)(req, res, next);
};

/**
 * @desc Endpoint for oautCallCallBack
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.oauthCallback = (req, res, next) => {
  const strategy = req.params.strategy;
  passport.authenticate(strategy, (err, user) => {
    if (err) responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    else if (!user) responses.error(res, 422, 'Unprocessable Entity', errors.getMessage('could not define user in oAuth'))(err);
    else {
      const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
      res.cookie('TOKEN', token, { httpOnly: true });
      res.redirect(302, `${config.cors.origin[0]}/token`);
    }
  })(req, res, next);
};

/**
 * @desc Endpoint to save oAuthProfile
 * @param {Object} req - Express request object
 * @param {Object} providerUserProfile
 * @param {Function} done - done
 */
exports.saveOAuthUserProfile = async (userProfile, indentifier, provider) => {
  // check if user exist
  try {
    const query = {};
    query[`providerData.${indentifier}`] = userProfile[indentifier];
    query.provider = provider;
    console.log('query', query);
    const search = await UserService.search(query);
    if (search.length === 1) return search[0];
  } catch (err) {
    console.log('err', err);
    throw new AppError('saveOAuthUserProfile', { code: 'SERVICE_ERROR', details: err });
  }
  // if no, generate
  try {
    const user = {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      avatar: userProfile.avatar || '',
      provider: userProfile.provider,
      providerData: userProfile.providerData || null,
    };
    const result = model.getResultFromJoi(user, UsersSchema.User, _.clone(config.joi.validationOptions));
    if (result && result.error) throw new AppError('saveOAuthUserProfile schema validation', { code: 'SERVICE_ERROR', details: result.error });
    return await UserService.create(result.value);
  } catch (err) {
    console.log('err', err);
    throw new AppError('saveOAuthUserProfile', { code: 'SERVICE_ERROR', details: err });
  }
};
