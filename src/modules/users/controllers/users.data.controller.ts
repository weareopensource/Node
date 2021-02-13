/**
 * Module dependencies
 */
import { Response } from 'express';
import config from '../../../config';
import getMessage from '../../../lib/helpers/errors';
import sendMail from '../../../lib/helpers/mails';
import { NodeRequest, error, success } from '../../../lib/helpers/responses';
import * as TaskDataService from '../../tasks/services/tasks.data.service';
import * as UploadDataService from '../../uploads/services/uploads.data.service';
import * as UserService from '../services/user.service';

/**
 * @desc Endpoint to ask the service to delete the user connected and all his data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteUser(req: NodeRequest, res: Response) {
  try {
    const result = {
      user: await UserService.deleteUser(req.user),
      tasks: await TaskDataService.deleteTask(req.user),
      uploads: await UploadDataService.deleteMany(req.user),
    };
    result.user.id = req.user.id;
    success(res, 'user and his data were deleted')(result);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to get all user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function get(req: NodeRequest, res: Response) {
  try {
    const result = {
      user: await UserService.get(req.user),
      tasks: await TaskDataService.list(req.user),
      uploads: await UploadDataService.list(req.user),
    };
    success(res, 'user data')(result);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to get all user data and send it to user mail
 */
export async function getMail(req: NodeRequest, res: Response) {
  try {
    // const result = {
    //   user: await UserService.get(req.user),
    //   tasks: await TaskDataService.list(req.user),
    //   uploads: await UploadDataService.list(req.user),
    // };

    // send mail
    const mail = await sendMail({
      from: config.mailer.from,
      to: req.user.email,
      subject: `${config.app.title}: your data`,
      // params: {
      //   result: JSON.stringify(result),
      //   displayName: `${req.user.firstName} ${req.user.lastName}`,
      //   appName: config.app.title,
      //   appContact: config.app.contact,
      // },
    });

    if (!mail.accepted) return error(res, 400, 'Bad Request', 'Failure sending email')();
    success(res, 'An email has been sent to the user email with data')({ status: true });
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}
