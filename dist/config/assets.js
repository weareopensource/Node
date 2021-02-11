"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint comma-dangle:[0, "only-multiline"] */
exports.default = {
    gulpConfig: ['gulpfile.ts'],
    allts: ['server.ts', 'config/**/*.ts', 'lib/**/*.ts', 'modules/*/**/*.ts'],
    mongooseModels: 'modules/*/models/*.mongoose.ts',
    sequelizeModels: 'modules/*/models/*.sequelize.ts',
    routes: ['modules/!(core)/routes/*.ts', 'modules/core/routes/*.ts'],
    // sockets: 'modules/*/sockets/*.ts',
    config: ['modules/*/config/*.ts'],
    policies: 'modules/*/policies/*.ts',
    tests: ['modules/*/tests/**/*.ts'],
    views: ['modules/*/views/*.html'],
};
//# sourceMappingURL=assets.js.map