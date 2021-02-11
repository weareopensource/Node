"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const handlebars_1 = tslib_1.__importDefault(require("handlebars"));
const config = require(path_1.default.resolve('./config'));
const files = require(path_1.default.resolve('./lib/helpers/files'));
const smtpTransport = nodemailer_1.default.createTransport(config.mailer.options);
/**
 * @desc Function to send a mail
 * @param {Object} mail
 * @return {String} true
 */
async function sendMail(mail) {
    const file = await files.readFile(path_1.default.resolve(`./config/templates/${mail.html}.html`));
    const template = handlebars_1.default.compile(file);
    const html = template(mail.text);
    try {
        return await smtpTransport.sendMail({
            from: mail.from,
            to: mail.to,
            subject: mail.subject,
            html,
        });
    }
    catch (err) {
        return `Mail config error, ${err}`;
    }
}
exports.default = sendMail;
//# sourceMappingURL=mails.js.map