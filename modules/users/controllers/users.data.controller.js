/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const mails = require(path.resolve('./lib/helpers/mails'));
const config = require(path.resolve('./config'));
const UserService = require('../services/user.service');

const TaskDataService = require(path.resolve('./modules/tasks/services/tasks.data.service'));
const UploadDataService = require(path.resolve('./modules/uploads/services/uploads.data.service'));

/**
 * @desc Endpoint to ask the service to delete the user connected and all his data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    const result = {
      user: await UserService.delete(req.user),
      tasks: await TaskDataService.delete(req.user),
      uploads: await UploadDataService.delete(req.user),
    };
    responses.success(res, 'user and his data were deleted')({ id: req.user.id, ...result });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to get all user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.get = async (req, res) => {
  try {
    const result = {
      user: await UserService.get(req.user),
      tasks: await TaskDataService.list(req.user),
      uploads: await UploadDataService.list(req.user),
    };
    responses.success(res, 'user data')(result);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to get all user data and send it to user mail
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMail = async (req, res) => {
  try {
    const result = {
      user: await UserService.get(req.user),
      tasks: await TaskDataService.list(req.user),
      uploads: await UploadDataService.list(req.user),
    };

    // send mail
    const mail = await mails.sendMail({
      template: 'data-privacy-email',
      from: config.mailer.from,
      to: req.user.email,
      subject: `${config.app.title}: your data`,
      params: {
        result: JSON.stringify(result),
        displayName: `${req.user.firstName} ${req.user.lastName}`,
        appName: config.app.title,
        appContact: config.app.contact,
      },
    });

    if (!mail.accepted) return responses.error(res, 400, 'Bad Request', 'Failure sending email')();
    responses.success(res, 'An email has been sent to the user email with data')({ status: true });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};
