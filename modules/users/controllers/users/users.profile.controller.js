/**
 * Module dependencies
 */
const path = require('path');
const jwt = require('jsonwebtoken');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const config = require(path.resolve('./config'));
const UserService = require('../../services/user.service');
const oAuthService = require('../../services/user.service');

/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  try {
    const user = await UserService.update(req.user, req.body);
    // reset login
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'user updated')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to delete the user connected
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    const result = await UserService.delete(req.user);
    result.id = req.user.id;
    responses.success(res, 'user deleted')(result);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};


/**
 * @desc Endpoint to ask the service to update a user profile picture
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfilePicture = async (req, res) => {
  try {
    await UserService.uploadImage(req, res, config.uploads.profile.avatar);
    if (req.user.profileImageURL) await UserService.deleteImage(req.user.profileImageURL);
    // add new image path to user
    const profileImageURL = config.uploads.profile.avatar.dest + req.file.filename;
    const user = await UserService.update(req.user, { profileImageURL });
    // reset login
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'profile picture updated')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to sanitize the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.me = (req, res) => {
  // Sanitize the user - short term solution. Copied from core.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
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
  return responses.success(res, 'user get')(user);
};

/**
 * @desc Endpoint to add oAuthProvider
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addOAuthProviderUserProfile = async (req, res) => {
  let user;
  try {
    user = await oAuthService.addUser(req.body.provider, req.body.idToken);
  } catch (err) {
    return responses.error(res, 304, 'Not Modified', errors.getMessage(err))(err);
  }
  if (!user) return responses.error(res, 404, 'Not Found', 'No Oauth found')();

  const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

  res.status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({ user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000) });
};
