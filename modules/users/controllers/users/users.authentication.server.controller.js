/**
 * Module dependencies
 */
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const config = require(path.resolve('./config'));
const configuration = require(path.resolve('./config'));
const ApiError = require(path.resolve('./lib/helpers/ApiError'));
const errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller'));
const UserService = require('../../services/user.service');
// URLs for which user can't be redirected on signin
const noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup',
];

/**
 * Signup
 */
exports.signup = async ({ body }, res, next) => {
  try {
    let user = await UserService.signUp(body);
    user = user.toObject({ getters: true });
    const token = jwt.sign({ userId: user.id }, config.jwt.secret);
    return res.status(200)
      .cookie('TOKEN', token, { httpOnly: true })
      .json({ user, tokenExpiresIn: Date.now() + (3600 * 24 * 1000) });
  } catch (err) {
    return next(new ApiError(err.message));
  }
};

/**
 * Signin after passport authentication
 */
exports.signin = async (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user.id }, configuration.jwt.secret);
  return res.status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({ user, tokenExpiresIn: Date.now() + (3600 * 24 * 1000) });
};

/**
 * Signout
 */
exports.signout = (req, res) => {
  req.logout();
  return res.status(200).send();
};

/**
 * Jwt Token Auth
 */
exports.token = async ({ body }, res, next) => {
  try {
    // Authenticate the user based on credentials
    // @TODO be consistent with whether the login field for user identification
    // is a username or an email
    const username = body.email;
    const password = body.password;
    const user = await UserService.authenticate(username, password);

    // Create the token and send
    // @TODO properly create the token with all of its metadata
    const payload = {
      id: user.id,
    };
    // @TODO properly sign the token, not with a shared secret (use pubkey instead),
    // and specify proper expiration, issuer, algorithm, etc.
    const token = jwt.sign(payload, config.jwt.secret);

    res.status(200).cookies('TOKEN', token);
  } catch (err) {
    next(new ApiError(err.message));
  }
};

/**
 * OAuth provider call
 */
exports.oauthCall = (req, res, next) => {
  const strategy = req.params.strategy;
  passport.authenticate(strategy)(req, res, next);
};

/**
 * OAuth callback
 */
exports.oauthCallback = (req, res, next) => {
  const strategy = req.params.strategy;

  // info.redirect_to contains intended redirect path
  passport.authenticate(strategy, (err, user, { redirectTo }) => {
    if (err) {
      res.redirect(`/authentication/signin?err=${encodeURIComponent(errorHandler.getErrorMessage(err))}`);
    }
    if (!user) {
      res.redirect('/authentication/signin');
    } else {
      req.login(user, (errLogin) => {
        if (errLogin) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectTo || '/');
      });
    }
  })(req, res, next);
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = (req, providerUserProfile, done) => {
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

    User.findOne(searchQuery, (err, user) => {
      if (err) {
        done(err);
      } if (!user) {
        const possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

        User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
          user = new User({
            firstName: providerUserProfile.firstName,
            lastName: providerUserProfile.lastName,
            username: availableUsername,
            displayName: providerUserProfile.displayName,
            profileImageURL: providerUserProfile.profileImageURL,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData,
          });

          // Email intentionally added later to allow defaults (sparse settings) to be applid.
          // Handles case where no email is supplied.
          // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
          user.email = providerUserProfile.email;

          // And save the user
          user.save(errSave => done(errSave, user, info));
        });
      } else {
        done(err, user, info);
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    const user = req.user;

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
      user.save(err => done(err, user, info));
    } else {
      done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = (req, res) => {
  const user = req.user;
  const provider = req.query.provider;

  if (!user) {
    res.status(401).json({
      message: 'User is not authenticated',
    });
  } if (!provider) {
    res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save((err) => {
    if (err) {
      res.status(422).send({
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      req.login(user, (errLogin) => {
        if (errLogin) {
          res.status(400).send(errLogin);
        } else {
          res.json(user);
        }
      });
    }
  });
};
