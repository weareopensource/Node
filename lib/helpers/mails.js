/**
 * Module dependencies
 */
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

import config from '../../config/index.js';
import files from './files.js';

const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * @desc Function to send a mail
 * @param {Object} mail
 * @return {String} true
 */
const sendMail = async (mail) => {
  const file = await files.readFile(path.resolve(`./config/templates/${mail.template}.html`));
  const template = handlebars.compile(file);
  const html = template(mail.params);
  try {
    return await smtpTransport.sendMail({
      from: config.mailer ? config.mailer.from : null,
      to: mail.to,
      subject: mail.subject,
      html,
    });
  } catch (err) {
    return `Mail config error, ${err}`;
  }
};

export default {
  sendMail,
};
