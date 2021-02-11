"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const policy = require(path_1.default.resolve('./lib/middlewares/policy'));
const home = require('../controllers/home.controller');
/**
 * Routes
 */
exports.default = (app) => {
    // changelogs
    app.route('/api/home/releases').all(policy.isAllowed)
        .get(home.releases);
    // changelogs
    app.route('/api/home/changelogs').all(policy.isAllowed)
        .get(home.changelogs);
    // changelogs
    app.route('/api/home/team').all(policy.isAllowed)
        .get(home.team);
    // markdown files
    app.route('/api/home/pages/:name').all(policy.isAllowed)
        .get(home.page);
    // Finish by binding the task middleware
    app.param('name', home.pageByName);
};
//# sourceMappingURL=home.route.js.map