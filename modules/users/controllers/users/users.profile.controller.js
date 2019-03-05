/**
 * Module dependencies
 */
const path = require('path');
const jwt = require('jsonwebtoken');

const errorHandler = require(path.resolve('./modules/core/controllers/errors.controller'));
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
      if (errLogin) return res.status(400).send(errLogin);
      return res.json(user);
    });
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * @desc Endpoint to ask the service to update a user profile picture
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.changeProfilePicture = async (req, res) => {
  try {
    await UserService.uploadImage(req, res, config.uploads.profile.avatar);
    if (req.user.profileImageURL) await UserService.deleteImage(req.user.profileImageURL);
    // add new image path to user
    const profileImageURL = config.uploads.profile.avatar.dest + req.file.filename;
    const user = await UserService.update(req.user, { profileImageURL });
    // reset login
    req.login(user, (errLogin) => {
      if (errLogin) return res.status(400).send(errLogin);
      return res.json(user);
    });
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
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
  let safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      id: req.user.id,
      provider: escape(req.user.provider),
      username: escape(req.user.username),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: escape(req.user.email),
      lastName: escape(req.user.lastName),
      firstName: escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData,
    };
  }
  res.json(safeUserObject || null);
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
    console.log(err);
    return res.sendStatus(304);
  }
  if (!user) return res.status(404).send('No Oauth found'); // TODO: Change this into something else

  const token = jwt.sign({ userId: user.id }, config.jwt.secret);

  res.status(200)
    .cookie('TOKEN', token, { httpOnly: true })
    .json({ user, tokenExpiresIn: Date.now() + (3600 * 24 * 1000) });
};
