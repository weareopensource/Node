"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const development_1 = tslib_1.__importDefault(require("./development"));
exports.default = lodash_1.default.merge(development_1.default, {
    app: {
        title: 'WeAreOpenSource Node - Test Environment',
    },
    api: {
        host: 'localhost',
        port: 3001,
    },
    port: 3001,
    db: {
        uri: 'mongodb://localhost/WaosNodeTest',
        debug: false,
    },
    livereload: false,
});
//# sourceMappingURL=test.js.map