
/**
 * Module dependencies
 */
const path = require('path');
const nodemailer = require('nodemailer');

const config = require(path.resolve('./config'));
const AppError = require(path.resolve('./lib/helpers/AppError'));
const responses = require(path.resolve('./lib/helpers/responses'));
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
exports.sendMail = (res, mail, answer) => {
  res.render(mail.template, mail.params, async (err, html) => {
    if (!err) {
      const send = await smtpTransport.sendMail({
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        html,
      }).then(() => 'success')
        .catch((error) => error);
      if (send !== 'success') return responses.error(res, 400, 'Bad Request', answer.error)(answer.data);
      responses.success(res, answer.success)(answer.data);
    }
    return new AppError(err, { code: 'HELPER_ERROR' });
  });
};
