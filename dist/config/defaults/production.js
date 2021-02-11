"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const development_1 = tslib_1.__importDefault(require("./development"));
exports.default = lodash_1.default.merge(development_1.default, {
    app: {
        title: 'WeAreOpenSource Node - Production Environment',
    },
    api: {
        host: '0.0.0.0',
        port: 4200,
    },
    db: {
        uri: 'mongodb://localhost/WaosNode',
        debug: false,
    },
    secure: {
        ssl: false,
        privateKey: './config/sslcerts/key.pem',
        certificate: './config/sslcerts/cert.pem',
        caBundle: './config/sslcerts/cabundle.crt',
    },
    log: {
        format: 'custom',
        pattern: ':id :email :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    },
    livereload: false,
});
//# sourceMappingURL=production.js.map