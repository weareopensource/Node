/**
 * Module dependencies
 */
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const config = require(path.resolve('./config'));
const files = require(path.resolve('./lib/helpers/files'));
const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * @desc Function to send a mail
 * @param {Object} mail
 * @return {String} true
 */
exports.sendMail = async (mail) => {
  const file = await files.readFile(path.resolve(`./config/templates/${mail.template}.html`));
  const template = handlebars.compile(file);
  const html = template(mail.params);
  try {
    return await smtpTransport.sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html,
    });
  } catch (err) {
    return `Mail config error, ${err}`;
  }
};
