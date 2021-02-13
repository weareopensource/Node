/**
 * Module dependencies
 */
import { Response } from 'express';
import getMessage from '../../../lib/helpers/errors';
import { NodeRequest, success, error } from '../../../lib/helpers/responses';
import * as TasksService from '../services/tasks.service';

/**
 * @desc Endpoint to ask the service to get the list of tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function list(req: NodeRequest, res: Response) {
  try {
    const tasks = await TasksService.list();
    success(res, 'task list')(tasks);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to create a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function create(req: NodeRequest, res: Response) {
  try {
    const task = await TasksService.create(req.body, req.user);
    success(res, 'task created')(task);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to show the current task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function get(req: NodeRequest, res: Response) {
  const task = req.task ? req.task.toJSON() : {};
  success(res, 'task get')(task);
}

/**
 * @desc Endpoint to ask the service to update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function update(req: NodeRequest, res: Response) {
  // TODO if (req.task && req.user && req.task.user && req.task.user.id === req.user.id) next();
  try {
    const task = await TasksService.update(req.task, req.body);
    success(res, 'task updated')(task);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteTask(req: NodeRequest, res: Response) {
  try {
    const result = await TasksService.deleteTask(req.task);
    result.id = req.task.id;
    success(res, 'task deleted')(result);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to get  stats of tasks and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function stats(req: NodeRequest, res: Response) {
  try {
    const data = await TasksService.stats();
    success(res, 'tasks stats')(data);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc MiddleWare to ask the service the task for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - task id
 */
export async function taskByID(req, res, next, id) {
  try {
    const task = await TasksService.get(id);
    if (!task) error(res, 404, 'Not Found', 'No Task with that identifier has been found')();
    else {
      req.task = task;
      if (task.user) req.isOwner = task.user._id; // user id used if we proteck road by isOwner policy
      next();
    }
  } catch (err) {
    next(err);
  }
}
