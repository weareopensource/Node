/**
 * Module dependencies
 */
const path = require('path');

const jwt = require('jsonwebtoken');
const AuthService = require('../../services/auth.service');

const UserService = require(path.resolve('./modules/users/services/user.service'));
const mails = require(path.resolve('./lib/helpers/mails'));
const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const config = require(path.resolve('./config'));

/**
 * @desc Endpoint to init password reset mail
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.forgot = async (req, res) => {
  let user;
  // check input
  if (!req.body.email) return responses.error(res, 422, 'Unprocessable Entity', 'Mail field must not be blank')();
  // get user generate and add token
  try {
    user = await UserService.getBrut({ email: req.body.email });
    if (!user) return responses.error(res, 400, 'Bad Request', 'No account with that email has been found')();
    if (user.provider !== 'local')
      return responses.error(res, 400, 'Bad Request', `It seems like you signed up using your ${user.provider} account`)();
    const edit = {
      resetPasswordToken: jwt.sign({ exp: Date.now() + 3600000 }, config.jwt.secret, { algorithm: 'HS256' }),
      resetPasswordExpires: Date.now() + 3600000,
    };
    user = await UserService.update(user, edit, 'recover');
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
  // send mail
  const mail = await mails.sendMail({
    template: 'reset-password-email',
    from: config.mailer.from,
    to: user.email,
    subject: 'Password Reset',
    params: {
      displayName: `${user.firstName} ${user.lastName}`,
      url: `${config.cors.origin[0]}/reset?token=${user.resetPasswordToken}`,
      appName: config.app.title,
      appContact: config.app.contact,
    },
  });
  if (!mail.accepted) return responses.error(res, 400, 'Bad Request', 'Failure sending email')();
  responses.success(res, 'An email has been sent with further instructions')({ status: true });
};

/**
 * @desc Endpoint to validate Reset Token from link
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.validateResetToken = async (req, res) => {
  try {
    const user = await UserService.getBrut({ resetPasswordToken: req.params.token });
    if (!user || !user.email) return res.redirect('/api/password/reset/invalid');
    res.redirect(`/api/password/reset/${req.params.token}`);
  } catch (err) {
    return res.redirect('/api/password/reset/invalid');
  }
};

/**
 * @desc Endpoint to reset password from url with token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.reset = async (req, res) => {
  let user;
  // check input
  if (!req.body.token || !req.body.newPassword) return responses.error(res, 400, 'Bad Request', 'Password or Token fields must not be blank')();
  // get user by token, update with new password, login again
  try {
    user = await UserService.getBrut({ resetPasswordToken: req.body.token });
    if (!user || !user.email) return responses.error(res, 400, 'Bad Request', 'Password reset token is invalid or has expired.')();
    const edit = {
      password: await AuthService.hashPassword(req.body.newPassword),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    };
    user = await UserService.update(user, edit, 'recover');
    return res
      .status(200)
      .cookie('TOKEN', jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn }), { httpOnly: true })
      .json({
        user,
        tokenExpiresIn: Date.now() + config.jwt.expiresIn * 1000,
        type: 'sucess',
        message: 'Password changed successfully',
      });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
  // send mail
  const mail = await mails.sendMail({
    template: 'reset-password-confirm-email',
    from: config.mailer.from,
    to: user.email,
    subject: 'Your password has been changed',
    params: {
      displayName: `${user.firstName} ${user.lastName}`,
      appName: config.app.title,
      appContact: config.app.contact,
    },
  });
  if (!mail.accepted) return responses.error(res, 400, 'Bad Request', 'Failure sending email')();
  responses.success(res, 'An email has been sent with further instructions')({ status: true });
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
    user = await UserService.getBrut({ id: req.user.id });
    if (!user || !user.email) return responses.error(res, 400, 'Bad Request', 'User is not found')();
    if (!(await AuthService.comparePassword(req.body.currentPassword, user.password)))
      return responses.error(res, 422, 'Unprocessable Entity', 'Current password is incorrect')();
    if (req.body.newPassword !== req.body.verifyPassword) return responses.error(res, 422, 'Unprocessable Entity', 'Passwords do not match')();
    password = AuthService.checkPassword(req.body.newPassword);
    user = await UserService.update(user, { password }, 'recover');
    return res
      .status(200)
      .cookie('TOKEN', jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn }), { httpOnly: true })
      .json({
        user,
        tokenExpiresIn: Date.now() + config.jwt.expiresIn * 1000,
        type: 'sucess',
        message: 'Password changed successfully',
      });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};
