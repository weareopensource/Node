"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTask = exports.deleteTask = exports.list = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const TasksRepository = tslib_1.__importStar(require("../repositories/tasks.repository"));
/**
 * @desc Function to ask repository to get all task from a specific user
 * @param {Object} user
 * @return {Promise} user tasks
 */
async function list(user) {
    const result = await TasksRepository.list({ user: user._id });
    return Promise.resolve(result);
}
exports.list = list;
/**
 * @desc Function to ask repository to delete all task from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
async function deleteTask(user) {
    const result = await TasksRepository.deleteMany({ user: user._id });
    return Promise.resolve(result);
}
exports.deleteTask = deleteTask;
function importTask(tasks, filters) {
    return TasksRepository.importTask(tasks, filters);
}
exports.importTask = importTask;
//# sourceMappingURL=tasks.data.service.js.map