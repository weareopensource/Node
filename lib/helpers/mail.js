
/**
 * Module dependencies
 */
const path = require('path');
const nodemailer = require('nodemailer');

const config = require(path.resolve('./config'));
const AppError = require(path.resolve('./lib/helpers/AppError'));
const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * @desc Function to generate an email template
 * @param {Object} res
 * @param {String} title
 * @param {String} displayName
 * @param {String} token
 * @return {String} html template
 */
exports.generateTemplate = (res, title, displayName, token) => {
  const baseUrl = `${config.cors.protocol}://${config.cors.host}:${config.cors.port}`;
  const params = {
    name: displayName,
    appName: config.app.title,
  };
  if (token) params.url = `${baseUrl}/auth/password-reset?token=${token}`;

  res.render(title, params, (err, result) => {
    if (!err) return result;
    console.log('err', err);
    return new AppError(err, { code: 'HELPER_ERROR' });
  });
};

/**
 * @desc Function to send a mail
 * @param {String} from
 * @param {String} to
 * @param {String} subject
 * @param {Object} template
 * @return {Boolean} true
 */
exports.sendMail = (from, to, subject, template) => {
  smtpTransport.sendMail({
    from,
    to,
    subject,
    template,
  }, (err) => {
    if (!err) return { type: 'success' };
    return new AppError(err, { code: 'HELPER_ERROR' });
  });
};
