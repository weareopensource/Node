"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageByName = exports.page = exports.team = exports.changelogs = exports.releases = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const responses_1 = require("../../../lib/helpers/responses");
const errors = require(path_1.default.resolve('./lib/helpers/errors'));
const HomeService = require('../services/home.service');
/**
 * @desc Endpoint to ask the service to get the releases
 */
async function releases(req, res) {
    try {
        const results = await HomeService.releases();
        responses_1.success(res, 'releases')(results);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.releases = releases;
/**
 * @desc Endpoint to ask the service to get the changelogs
 */
async function changelogs(req, res) {
    try {
        const results = await HomeService.changelogs();
        responses_1.success(res, 'changelogs')(results);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.changelogs = changelogs;
/**
 * @desc Endpoint to ask the service to get the list of users
 */
async function team(req, res) {
    try {
        const users = await HomeService.team();
        responses_1.success(res, 'team list')(users);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.team = team;
/**
 * @desc Endpoint to ask the service to get a page
 */
async function page(req, res) {
    try {
        responses_1.success(res, 'page')(req.page);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    }
}
exports.page = page;
/**
 * @desc MiddleWare to ask the service the file for this name
 */
async function pageByName(req, res, next, name) {
    try {
        if (!fs_1.default.existsSync(`./config/markdown/${name}.md`))
            return responses_1.error(res, 404, 'Not Found', 'No page with that name has been found')();
        req.page = await HomeService.page(name);
        next();
    }
    catch (err) {
        next(err);
    }
}
exports.pageByName = pageByName;
//# sourceMappingURL=home.controller.js.map