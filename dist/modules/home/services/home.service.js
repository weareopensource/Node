"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.team = exports.changelogs = exports.releases = exports.page = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const axios_1 = tslib_1.__importDefault(require("axios"));
const path_1 = tslib_1.__importDefault(require("path"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const js_base64_1 = require("js-base64");
const fs_1 = require("fs");
const UserService = require(path_1.default.resolve('./modules/users/services/user.service'));
const config = require(path_1.default.resolve('./config'));
const HomeRepository = require('../repositories/home.repository');
/**
 * @desc Function to get all admin users in db
 * @return {Promise} All users
 */
async function page(name) {
    const markdown = await fs_1.promises.readFile(path_1.default.resolve(`./config/markdown/${name}.md`), 'utf8');
    const test = await fs_1.promises.stat(path_1.default.resolve(`./config/markdown/${name}.md`));
    return Promise.resolve([{
            title: lodash_1.default.startCase(name),
            updatedAt: test.mtime,
            markdown,
        }]);
}
exports.page = page;
/**
 * @desc Function to get all versions
 */
async function releases() {
    const requests = config.repos.map((item) => axios_1.default.get(`https://api.github.com/repos/${item.owner}/${item.repo}/releases`, {
        headers: item.token ? { Authorization: `token ${item.token}` } : {},
    }));
    const results = await axios_1.default.all(requests);
    return results.map((result, i) => ({
        title: config.repos[i].title,
        list: result.data.map((release) => ({
            name: release.name,
            prerelease: release.prerelease,
            published_at: release.published_at,
        })),
    }));
}
exports.releases = releases;
/**
 * @desc Function to get all changelogs
 * @return {Promise} All changelogs
 */
async function changelogs() {
    const repos = lodash_1.default.filter(config.repos, (repo) => repo.changelog);
    const requests = repos.map((item) => axios_1.default.get(`https://api.github.com/repos/${item.owner}/${item.repo}/contents/${item.changelog}`, {
        headers: item.token ? { Authorization: `token ${item.token}` } : {},
    }));
    let results = await axios_1.default.all(requests);
    results = results.map((result, i) => ({
        title: config.repos[i].title,
        markdown: js_base64_1.Base64.decode(result.data.content),
    }));
    return Promise.resolve(results);
}
exports.changelogs = changelogs;
/**
 * @desc Function to get all admin users in db
 * @return {Promise} All users
 */
async function team() {
    const result = await HomeRepository.team();
    return Promise.resolve(result.map((user) => UserService.removeSensitive(user)));
}
exports.team = team;
//# sourceMappingURL=home.service.js.map