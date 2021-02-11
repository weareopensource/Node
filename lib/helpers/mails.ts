/**
 * Module dependencies
 */
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

const config = require(path.resolve('./config'));
const files = require(path.resolve('./lib/helpers/files'));
const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * @desc Function to send a mail
 * @param {Object} mail
 * @return {String} true
 */
export default async function sendMail(mail: nodemailer.SendMailOptions): Promise<any> {
  const file = await files.readFile(path.resolve(`./config/templates/${mail.html}.html`));
  const template = handlebars.compile(file);
  const html = template(mail.text);
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
}
