/**
 * Module dependencies
 */
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import config from '../../config';
import readFile from './files';

const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * @desc Function to send a mail
 */
export default async function sendMail(mail: nodemailer.SendMailOptions): Promise<any> {
  const file = await readFile(path.resolve(`./config/templates/${mail.html}.html`));
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
