/**
 * Module dependencies
 */
const path = require('path');

const jwt = require('jsonwebtoken');
const UserService = require('../../services/user.service');

const mail = require(path.resolve('./lib/helpers/mail'));
const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const configuration = require(path.resolve('./config'));
const config = require(path.resolve('./config'));

/**
 * @desc Endpoint to init password reset mail
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.forgot = async (req, res) => {
  let user;
  let token;
  let send;

  // check input
  if (!req.body.email) return responses.error(res, 422, 'Mail field must not be blank')();

  try {
    // get user
    user = await UserService.get({ email: req.body.email });
    if (!user) return responses.error(res, 400, 'No account with that email has been found')();
    if (user.provider !== 'local') return responses.error(res, 400, `It seems like you signed up using your ${user.provider} account`)();
    // update user with recover token
    const payload = { exp: Date.now() + 3600000 };
    const edit = {
      resetPasswordToken: jwt.sign(payload, configuration.jwt.secret, { algorithm: 'HS256' }),
      resetPasswordExpires: Date.now() + 3600000,
    };
    user = await UserService.update(user, edit, 'recover');
  } catch (err) {
    responses.error(res, 422, errors.getMessage(err))(err);
  }

  const template = mail.generateTemplate(res, 'reset-password-email', user.displayName, token);
  if (template) send = mail.sendMail(config.mailer.from, user.email, 'Password Reset', template);
  if (!template || !send) return responses.error(res, 400, 'Failure sending email')();
  responses.success(res, 'An email has been sent to the provided email with further instructions.')();
};

/**
 * @desc Endpoint to validate Reset Token from link
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.validateResetToken = async (req, res) => {
  try {
    const users = await UserService.search({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (users.length === 0) return res.redirect('/password/reset/invalid');
    res.redirect(`/password/reset/${req.params.token}`);
  } catch (err) {
    return res.redirect('/password/reset/invalid');
  }
};

/**
 * @desc Endpoint to reset password from url with token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.reset = async (req, res) => {
  // Init Variables
  const newPassword = req.body.newPassword;
  const resetPasswordToken = req.body.token;
  let user;
  let send;

  try {
    // Hash new password
    const password = await UserService.hashPassword(newPassword);
    // get user
    user = await UserService.search({
      resetPasswordToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) return responses.error(res, 400, 'Password reset token is invalid or has expired.')();
    // update user
    const edit = {
      password,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    };
    user = await UserService.update(user, edit, 'recover');
    // reset login
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, errors.getMessage(errLogin))(errLogin);
      user.password = undefined;
      user.salt = undefined;
      return responses.success(res, 'password reseted')(user);
    });
  } catch (err) {
    responses.error(res, 422, errors.getMessage(err))(err);
  }

  const template = mail.generateTemplate(res, 'reset-password-confirm-email', user.displayName);
  if (template) send = mail.sendMail(config.mailer.from, user.email, 'Your password has been changed', template);
  if (!template || !send) return responses.error(res, 400, 'Failure sending email')();
  responses.success(res, 'An email has been sent to the provided email with further instructions.')();
};

/**
 * Change Password
 */
exports.changePassword = async (req, res) => {
  // Init Variables
  const passwordDetails = req.body;
  let user;
  let password;

  if (!req.user) return responses.error(res, 401, 'User is not signed in')();
  if (!passwordDetails.newPassword) return responses.error(res, 422, 'Please provide a new password')();

  try {
    // get user
    user = await UserService.get({ id: req.user.id });
    if (!user) return responses.error(res, 400, 'User is not found')();
    // check password
    if (await UserService.comparePassword(passwordDetails.currentPassword, user.password)) {
      if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
        password = passwordDetails.newPassword;
      } else return responses.error(res, 422, 'Passwords do not match')();
    } else return responses.error(res, 422, 'Current password is incorrect')();
    // update user
    user = await UserService.update(user, { password }, 'recover');
    // reset login
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, errors.getMessage(errLogin))();
      responses.success(res, 'Password changed successfully')();
    });
  } catch (err) {
    responses.error(res, 422, errors.getMessage(err))(err);
  }
};
