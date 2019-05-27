/**
 * Module dependencies
 */
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require(path.resolve('./config'));
const configuration = require(path.resolve('./config'));
const responses = require(path.resolve('./lib/helpers/responses'));
const errors = require(path.resolve('./lib/helpers/errors'));
const UserService = require('../../services/user.service');

// URLs for which user can't be redirected on signin
const noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup',
];

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
      .json({ user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000) });
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
  const token = jwt.sign({ userId: user.id }, configuration.jwt.secret, { expiresIn: config.jwt.expiresIn });
  return res.status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({ user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000) });
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
      profileImageURL: req.user.profileImageURL,
      email: escape(req.user.email),
      lastName: escape(req.user.lastName),
      firstName: escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData,
    };
  }
  const token = jwt.sign({ userId: user.id }, configuration.jwt.secret, { expiresIn: config.jwt.expiresIn });
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

  // info.redirect_to contains intended redirect path
  passport.authenticate(strategy, (err, user, { redirectTo }) => {
    if (err) return res.redirect(`/authentication/signin?err=${encodeURIComponent(errors.getMessage(err))}`);
    if (!user) return res.redirect('/authentication/signin');
    req.login(user, (errLogin) => {
      if (errLogin) return res.redirect('/authentication/signin');
      return res.redirect(redirectTo || '/');
    });
  })(req, res, next);
};

/**
 * @desc Endpoint to save oAuthProfile
 * @param {Object} req - Express request object
 * @param {Object} providerUserProfile
 * @param {Function} done - done
 */
exports.saveOAuthUserProfile = async (req, providerUserProfile, done) => {
  // Setup info object
  const info = {};

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1) info.redirect_to = req.session.redirect_to;
  if (!req.user) {
    // Define a search query fields
    const searchMainProviderIdentifierField = `providerData.${providerUserProfile.providerIdentifierField}`;
    const searchAdditionalProviderIdentifierField = `additionalProvidersData.${providerUserProfile.provider}.${providerUserProfile.providerIdentifierField}`;
    // Define main provider search query
    const mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
    // Define additional provider search query
    const additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
    // Define a search query to find existing user with current provider profile
    const searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery],
    };

    let user;
    // check if user exist
    try {
      user = await UserService.search(searchQuery);
      if (user) done(user, info);
    } catch (err) {
      done(err);
    }
    // if no, generate the user
    try {
      user = {
        firstName: providerUserProfile.firstName,
        lastName: providerUserProfile.lastName,
        displayName: providerUserProfile.displayName,
        profileImageURL: providerUserProfile.profileImageURL,
        provider: providerUserProfile.provider,
        providerData: providerUserProfile.providerData,
      };
      // Email intentionally added later to allow defaults (sparse settings) to be applid.
      // Handles case where no email is supplied.
      // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
      user.email = providerUserProfile.email;
    } catch (err) {
      done(err);
    }
    // save the user
    try {
      user = await UserService.create(user);
      done(user, info);
    } catch (err) {
      done(err);
    }
  } else {
    // User is already logged in, join the provider data to the existing user
    let user = req.user;
    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
      // And save the user
      // save the user
      try {
        user = await UserService.create(user);
        done(user, info);
      } catch (err) {
        done(err);
      }
    } else {
      done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * @desc Endpoint for remove oAuth provider
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.removeOAuthProvider = async (req, res) => {
  let user = req.user;
  const provider = req.query.provider;

  if (!user) return responses.error(res, 422, 'Unprocessable Entity', 'User is not authenticated')();
  if (!provider) return responses.error(res, 400, 'Bad Request', 'Provider is not defined')();

  // Delete the additional provider and Then tell mongoose that we've updated the additionalProvidersData field
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];
    user.markModified('additionalProvidersData');
  }

  try {
    user = await UserService.create(user);
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request ', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'oAuth provider removed')(user);
    });
  } catch (err) {
    return responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};
