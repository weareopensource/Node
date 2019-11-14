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
  let send;

  // check input
  if (!req.body.email) return responses.error(res, 422, 'Unprocessable Entity', 'Mail field must not be blank')();

  // get user generate and add token
  try {
    user = await UserService.get({ email: req.body.email });
    if (!user) return responses.error(res, 400, 'Bad Request', 'No account with that email has been found')();
    if (user.provider !== 'local') return responses.error(res, 400, 'Bad Request', `It seems like you signed up using your ${user.provider} account`)();

    const edit = {
      resetPasswordToken: jwt.sign({ exp: Date.now() + 3600000 }, configuration.jwt.secret, { algorithm: 'HS256' }),
      resetPasswordExpires: Date.now() + 3600000,
    };
    user = await UserService.update(user, edit, 'recover');
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }

  // send mail
  const template = mail.generateTemplate(res, 'reset-password-email', user.displayName, user.resetPasswordToken);
  if (template) send = mail.sendMail(config.mailer.from, user.email, 'Password Reset', template);
  if (!template || !send) return responses.error(res, 400, 'Bad Request', 'Failure sending email')();
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
  let user;
  let send;

  // check input
  if (!req.body.token || !req.body.newPassword) return responses.error(res, 400, 'Bad Request', 'Password or Token fields must not be blank')();

  // get user by token, update with new password, login again
  try {
    user = await UserService.search({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (user.length !== 1) return responses.error(res, 400, 'Bad Request', 'Password reset token is invalid or has expired.')();

    const edit = {
      password: await UserService.hashPassword(req.body.newPassword),
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    };
    user = await UserService.update(user[0], edit, 'recover');

    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      user.password = undefined;
      return responses.success(res, 'password reseted')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }

  // send mail
  const template = mail.generateTemplate(res, 'reset-password-confirm-email', user.displayName);
  if (template) send = mail.sendMail(config.mailer.from, user.email, 'Your password has been changed', template);
  if (!template || !send) return responses.error(res, 400, 'Bad Request', 'Failure sending email')();
  responses.success(res, 'An email has been sent to the provided email with further instructions.')();
};

/**
 * Change Password
 */
exports.updatePassword = async (req, res) => {
  let user;
  let password;

  // check input
  if (!req.body.newPassword) return responses.error(res, 400, 'Bad Request', 'Please provide a new password')();

  // get user, check password, update user, login again
  try {
    user = await UserService.get({ id: req.user.id });
    if (!user) return responses.error(res, 400, 'Bad Request', 'User is not found')();

    if (!await UserService.comparePassword(req.body.currentPassword, user.password)) return responses.error(res, 422, 'Unprocessable Entity', 'Current password is incorrect')();
    if (req.body.newPassword !== req.body.verifyPassword) return responses.error(res, 422, 'Unprocessable Entity', 'Passwords do not match')();


    password = UserService.checkPassword(req.body.newPassword);

    user = await UserService.update(user, { password }, 'recover');

    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))();
      responses.success(res, 'Password changed successfully')();
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};
