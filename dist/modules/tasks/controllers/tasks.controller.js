"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskByID = exports.stats = exports.deleteTask = exports.update = exports.get = exports.create = exports.list = void 0;
const tslib_1 = require("tslib");
const responses_1 = require("../../../lib/helpers/responses");
const TasksService = tslib_1.__importStar(require("../services/tasks.service"));
/**
 * @desc Endpoint to ask the service to get the list of tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function list(req, res) {
    try {
        const tasks = await TasksService.list();
        responses_1.success(res, 'task list')(tasks);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.list = list;
/**
 * @desc Endpoint to ask the service to create a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function create(req, res) {
    try {
        const task = await TasksService.create(req.body, req.user);
        responses_1.success(res, 'task created')(task);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.create = create;
/**
 * @desc Endpoint to show the current task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function get(req, res) {
    const task = req.task ? req.task.toJSON() : {};
    responses_1.success(res, 'task get')(task);
}
exports.get = get;
/**
 * @desc Endpoint to ask the service to update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function update(req, res) {
    // TODO if (req.task && req.user && req.task.user && req.task.user.id === req.user.id) next();
    try {
        const task = await TasksService.update(req.task, req.body);
        responses_1.success(res, 'task updated')(task);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.update = update;
/**
 * @desc Endpoint to ask the service to delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteTask(req, res) {
    try {
        const result = await TasksService.deleteTask(req.task);
        result.id = req.task.id;
        responses_1.success(res, 'task deleted')(result);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.deleteTask = deleteTask;
/**
 * @desc Endpoint to get  stats of tasks and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function stats(req, res) {
    const data = await TasksService.stats();
    if (!data.err) {
        responses_1.success(res, 'tasks stats')(data);
    }
    else {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(data.err))(data.err);
    }
}
exports.stats = stats;
/**
 * @desc MiddleWare to ask the service the task for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - task id
 */
async function taskByID(req, res, next, id) {
    try {
        const task = await TasksService.get(id);
        if (!task)
            responses_1.error(res, 404, 'Not Found', 'No Task with that identifier has been found')();
        else {
            req.task = task;
            if (task.user)
                req.isOwner = task.user._id; // user id used if we proteck road by isOwner policy
            next();
        }
    }
    catch (err) {
        next(err);
    }
}
exports.taskByID = taskByID;
//# sourceMappingURL=tasks.controller.js.map