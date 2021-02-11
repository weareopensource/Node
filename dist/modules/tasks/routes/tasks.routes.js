"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const tasks = tslib_1.__importStar(require("../controllers/tasks.controller"));
const path_1 = tslib_1.__importDefault(require("path"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const model = require(path_1.default.resolve('./lib/middlewares/model'));
const policy = require(path_1.default.resolve('./lib/middlewares/policy'));
const tasksSchema = require('../models/tasks.schema');
/**
 * Routes
 */
module.exports = (app) => {
    // stats
    app.route('/api/tasks/stats').all(policy.isAllowed)
        .get(tasks.stats);
    // list & post
    app.route('/api/tasks')
        .get(tasks.list) // list
        .post(passport_1.default.authenticate('jwt'), policy.isAllowed, model.isValid(tasksSchema.Task), tasks.create); // create
    // classic crud
    app.route('/api/tasks/:taskId').all(passport_1.default.authenticate('jwt'), policy.isAllowed) // policy.isOwner available (require set in middleWare)
        .get(tasks.get) // get
        .put(model.isValid(tasksSchema.Task), tasks.update) // update
        .delete(model.isValid(tasksSchema.Task), tasks.deleteTask); // delete
    // Finish by binding the task middleware
    app.param('taskId', tasks.taskByID);
};
//# sourceMappingURL=tasks.routes.js.map