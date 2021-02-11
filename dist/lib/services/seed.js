"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSeed = exports.start = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies.
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = tslib_1.__importDefault(require("path"));
const config_1 = tslib_1.__importDefault(require("../../config"));
const AppError = require(path_1.default.resolve('./lib/helpers/AppError'));
// global seed options object
let seedOptions = {};
// save the specified user with the password provided from the resolved promise
const seedTheUser = (UserService, user) => async (password) => {
    user.password = password;
    if (user.email === seedOptions.seedAdmin.email && process.env.NODE_ENV === 'production' && await UserService.get(user))
        return new AppError(`Failed due to local account already exists: ${user.email}`);
    if (process.env.NODE_ENV === 'test' && await UserService.get(user))
        UserService.delete(user);
    try {
        const result = await UserService.create(user);
        if (seedOptions.logResults)
            console.log(chalk_1.default.bold.red(`Database Seeding:\t\t\tLocal ${user.email} added with password set to ${password}`));
        return result;
    }
    catch (err) {
        throw new AppError('Failed to seedTheUser.', { code: 'LIB_ERROR' });
    }
};
// save the specified user with the password provided from the resolved promise
const seedTasks = async (TaskService, task, user) => {
    try {
        const result = await TaskService.create(task, user);
        if (seedOptions.logResults)
            console.log(chalk_1.default.bold.red(`Database Seeding:\t\t\tLocal ${task.title} added`));
        return result;
    }
    catch (err) {
        throw new AppError('Failed to seedTasks.', { code: 'LIB_ERROR' });
    }
};
async function start(options, UserService, AuthService, TaskService) {
    let pwd;
    const result = [];
    // Check for provided options
    seedOptions = lodash_1.default.clone(config_1.default.seedDB.options);
    if (lodash_1.default.has(options, 'logResults'))
        seedOptions.logResults = options.logResults;
    if (lodash_1.default.has(options, 'seedUser'))
        seedOptions.seedUser = options.seedUser;
    if (lodash_1.default.has(options, 'seedAdmin'))
        seedOptions.seedAdmin = options.seedAdmin;
    if (lodash_1.default.has(options, 'seedTasks'))
        seedOptions.seedTasks = options.seedTasks;
    try {
        if (process.env.NODE_ENV === 'production') {
            pwd = await AuthService.generateRandomPassphrase();
            result.push(await seedTheUser(UserService, seedOptions.seedAdmin)(pwd));
        }
        else {
            pwd = await AuthService.generateRandomPassphrase();
            result.push(await seedTheUser(UserService, seedOptions.seedUser)(pwd));
            pwd = await AuthService.generateRandomPassphrase();
            result.push(await seedTheUser(UserService, seedOptions.seedAdmin)(pwd));
            if (process.env.NODE_ENV === 'development') {
                result.push(await seedTasks(TaskService, seedOptions.seedTasks[0], result[0]));
                result.push(await seedTasks(TaskService, seedOptions.seedTasks[1], result[1]));
            }
        }
    }
    catch (err) {
        console.log(err);
        return new AppError('Error on seed start.');
    }
    return result;
}
exports.start = start;
async function userSeed(user, UserService, AuthService) {
    let pwd;
    const result = [];
    // Check for provided options
    seedOptions = lodash_1.default.clone(config_1.default.seedDB.options);
    try {
        pwd = await AuthService.generateRandomPassphrase();
        result.push(await seedTheUser(UserService, user)(pwd));
    }
    catch (err) {
        console.log(err);
        return new AppError('Error on seed start.');
    }
    return result;
}
exports.userSeed = userSeed;
//# sourceMappingURL=seed.js.map