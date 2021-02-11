"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stats = exports.deleteTask = exports.update = exports.get = exports.create = exports.list = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const TasksRepository = tslib_1.__importStar(require("../repositories/tasks.repository"));
/**
 * @desc Function to get all task in db
 * @return {Promise} All tasks
 */
async function list() {
    const result = await TasksRepository.list();
    return Promise.resolve(result);
}
exports.list = list;
/**
 * @desc Function to ask repository to create a task
 * @param {Object} task
 * @return {Promise} task
 */
async function create(task, user) {
    task.user = user.id;
    const result = await TasksRepository.create(task);
    return Promise.resolve(result);
}
exports.create = create;
/**
 * @desc Function to ask repository to get a task
 * @param {String} id
 * @return {Promise} task
 */
async function get(id) {
    const result = await TasksRepository.get(id);
    return Promise.resolve(result);
}
exports.get = get;
/**
 * @desc Functio to ask repository to update a task
 * @param {Object} task - original task
 * @param {Object} body - task edited
 * @return {Promise} task
 */
async function update(task, body) {
    task.title = body.title;
    task.description = body.description;
    const result = await TasksRepository.update(task);
    return Promise.resolve(result);
}
exports.update = update;
/**
 * @desc Function to ask repository to delete a task
 * @param {Object} task
 * @return {Promise} confirmation of delete
 */
async function deleteTask(task) {
    const result = await TasksRepository.deleteTask(task);
    return Promise.resolve(result);
}
exports.deleteTask = deleteTask;
/**
 * @desc Function to get all stats of db
 * @return {Promise} All stats
 */
async function stats() {
    return TasksRepository.stats();
}
exports.stats = stats;
//# sourceMappingURL=tasks.service.js.map