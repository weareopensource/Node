
/**
 * Module dependencies
 */
const path = require('path');
const nodemailer = require('nodemailer');

const config = require(path.resolve('./config'));
const AppError = require(path.resolve('./lib/helpers/AppError'));
const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * @desc Function to send a mail
 * @param {Object} res
 * @param {String} template path
 * @param {Object} params
 * @param {String} from
 * @param {String} to
 * @param {String} subject
 * @return {String} true
 */
exports.sendMail = (res, template, params, from, to, subject) => {
  res.render(template, params, (err, html) => {
    if (!err) {
      smtpTransport.sendMail({
        from,
        to,
        subject,
        html,
      }, (err) => {
        if (!err) return { type: 'success' };
        return new AppError(err, { code: 'HELPER_ERROR' });
      });
    }
    return new AppError(err, { code: 'HELPER_ERROR' });
  });
};
