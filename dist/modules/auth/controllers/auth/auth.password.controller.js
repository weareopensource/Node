"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.reset = exports.validateResetToken = exports.forgot = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const errors_1 = tslib_1.__importDefault(require("../../../../lib/helpers/errors"));
const responses_1 = require("../../../../lib/helpers/responses");
const AuthService = require('../../services/auth.service');
const UserService = require(path_1.default.resolve('modules/users/services/user.service'));
const config = require(path_1.default.resolve('./config'));
/**
 * @desc Endpoint to init password reset mail
 */
async function forgot(req, res) {
    let user;
    // check input
    if (!req.body.email)
        return responses_1.error(res, 422, 'Unprocessable Entity', 'Mail field must not be blank')();
    // get user generate and add token
    try {
        user = await UserService.getBrut({ email: req.body.email });
        if (!user)
            return responses_1.error(res, 400, 'Bad Request', 'No account with that email has been found')();
        if (user.provider !== 'local')
            return responses_1.error(res, 400, 'Bad Request', `It seems like you signed up using your ${user.provider} account`)();
        const edit = {
            resetPasswordToken: jsonwebtoken_1.default.sign({ exp: Date.now() + 3600000 }, config.jwt.secret, { algorithm: 'HS256' }),
            resetPasswordExpires: Date.now() + 3600000,
        };
        user = await UserService.update(user, edit, 'recover');
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
    // send mail
    const mail = await mails.sendMail({
        template: 'reset-password-email',
        from: config.mailer.from,
        to: user.email,
        subject: 'Password Reset',
        params: {
            displayName: `${user.firstName} ${user.lastName}`,
            url: `${config.cors.origin[0]}/r eset?token=${user.resetPasswordToken}`,
            appName: config.app.title,
            appContact: config.app.contact,
        },
    });
    if (!mail.accepted)
        return responses_1.error(res, 400, 'Bad Request', 'Failure sending email')();
    responses_1.success(res, 'An email has been sent with further instructions')({ status: true });
}
exports.forgot = forgot;
/**
 * @desc Endpoint to validate Reset Token from link
 */
async function validateResetToken(req, res) {
    try {
        const user = await UserService.getBrut({ resetPasswordToken: req.params.token });
        if (!user || !user.email)
            return res.redirect('/api/password/reset/invalid');
        res.redirect(`/api/password/reset/${req.params.token}`);
    }
    catch (err) {
        return res.redirect('/api/password/reset/invalid');
    }
}
exports.validateResetToken = validateResetToken;
/**
 * @desc Endpoint to reset password from url with token
 */
async function reset(req, res) {
    let user;
    // check input
    if (!req.body.token || !req.body.newPassword)
        return responses_1.error(res, 400, 'Bad Request', 'Password or Token fields must not be blank')();
    // get user by token, update with new password, login again
    try {
        user = await UserService.getBrut({ resetPasswordToken: req.body.token });
        if (!user || !user.email)
            return responses_1.error(res, 400, 'Bad Request', 'Password reset token is invalid or has expired.')();
        const edit = {
            password: await AuthService.hashPassword(req.body.newPassword),
            resetPasswordToken: null,
            resetPasswordExpires: null,
        };
        user = await UserService.update(user, edit, 'recover');
        return res.status(200)
            .cookie('TOKEN', jsonwebtoken_1.default.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn }), { httpOnly: true })
            .json({
            user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000), type: 'sucess', message: 'Password changed successfully',
        });
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
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
    if (!mail.accepted)
        return responses_1.error(res, 400, 'Bad Request', 'Failure sending email')();
    responses_1.success(res, 'An email has been sent with further instructions')({ status: true });
}
exports.reset = reset;
/**
 * Change Password
 */
async function updatePassword(req, res) {
    let user;
    let password;
    // check input
    if (!req.body.newPassword)
        return responses_1.error(res, 400, 'Bad Request', 'Please provide a new password')();
    // get user, check password, update user, login again
    try {
        user = await UserService.getBrut({ id: req.user.id });
        if (!user || !user.email)
            return responses_1.error(res, 400, 'Bad Request', 'User is not found')();
        if (!await AuthService.comparePassword(req.body.currentPassword, user.password))
            return responses_1.error(res, 422, 'Unprocessable Entity', 'Current password is incorrect')();
        if (req.body.newPassword !== req.body.verifyPassword)
            return responses_1.error(res, 422, 'Unprocessable Entity', 'Passwords do not match')();
        password = AuthService.checkPassword(req.body.newPassword);
        user = await UserService.update(user, { password }, 'recover');
        return res.status(200)
            .cookie('TOKEN', jsonwebtoken_1.default.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn }), { httpOnly: true })
            .json({
            user, tokenExpiresIn: Date.now() + (config.jwt.expiresIn * 1000), type: 'sucess', message: 'Password changed successfully',
        });
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.updatePassword = updatePassword;
//# sourceMappingURL=auth.password.controller.js.map