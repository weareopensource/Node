"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies.
 */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const glob_1 = tslib_1.__importDefault(require("glob"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const object_path_1 = tslib_1.__importDefault(require("object-path"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 * Get files by glob patterns
 */
const getGlobbedPaths = (globPatterns, excludes) => {
    // URL paths regex
    /* eslint no-useless-escape:0 */
    const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
    let output = [];
    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (lodash_1.default.isArray(globPatterns)) {
        globPatterns.forEach((globPattern) => {
            output = lodash_1.default.union(output, getGlobbedPaths(globPattern, excludes));
        });
    }
    else if (lodash_1.default.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        }
        else {
            let files = glob_1.default.sync(globPatterns);
            if (excludes) {
                files = files.map((file) => {
                    if (lodash_1.default.isArray(excludes)) {
                        // @ts-ignore
                        excludes((exlude) => {
                            file = file.replace(exlude, '');
                        });
                    }
                    else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = lodash_1.default.union(output, files);
        }
    }
    return output;
};
/** Validate config.domain is set
 */
const validateDomainIsSet = (config) => {
    if (!config.domain) {
        console.log(chalk_1.default.red('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'));
    }
};
/**
 * validate secure parameters and create credentials in consequence value for ssl
 * @param config
 */
const initSecureMode = (config) => {
    if (!config.secure || config.secure.ssl !== true)
        return true;
    const key = fs_1.default.existsSync(path_1.default.resolve(config.secure.key));
    const cert = fs_1.default.existsSync(path_1.default.resolve(config.secure.cert));
    if (!key || !cert) {
        console.log(chalk_1.default.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
        console.log(chalk_1.default.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
        console.log();
        config.secure.ssl = false;
    }
    else {
        config.secure.credentials = {
            key: fs_1.default.readFileSync(path_1.default.resolve(config.secure.key)),
            cert: fs_1.default.readFileSync(path_1.default.resolve(config.secure.cert)),
        };
    }
};
/**
 * Initialize global configuration files
 */
const initGlobalConfigFiles = (config, assets) => {
    config.files = {}; // Appending files
    config.files.mongooseModels = getGlobbedPaths(assets.mongooseModels); // Setting Globbed mongoose model files
    config.files.sequelizeModels = getGlobbedPaths(assets.sequelizeModels); // Setting Globbed sequelize model files
    config.files.routes = getGlobbedPaths(assets.routes); // Setting Globbed route files
    config.files.configs = getGlobbedPaths(assets.config); // Setting Globbed config files
    // config.files.sockets = getGlobbedPaths(assets.sockets); // Setting Globbed socket files
    config.files.policies = getGlobbedPaths(assets.policies); // Setting Globbed policies files
};
/**
 * Initialize global configuration
 */
const initGlobalConfig = () => {
    // Get the default assets
    const assets = require(path_1.default.join(process.cwd(), './config/assets'));
    // Get the current config
    const pathConfig = path_1.default.join(process.cwd(), './config', 'defaults', process.env.NODE_ENV || 'development');
    let defaultConfig;
    if (fs_1.default.existsSync(`${pathConfig}.js`))
        defaultConfig = require(pathConfig);
    else {
        console.error(chalk_1.default.red(`+ Error: No configuration file found for "${process.env.NODE_ENV}" environment using development instead`));
        defaultConfig = require(path_1.default.join(process.cwd(), './config', 'defaults', 'development'));
    }
    // Get the config from  process.env.WAOS_NODE_*
    let environmentVars = lodash_1.default.mapKeys(lodash_1.default.pickBy(process.env, (_value, key) => key.startsWith('WAOS_NODE_')), (_v, k) => k.split('_').slice(2).join('.'));
    // convert string array from sys  to real array
    environmentVars = lodash_1.default.mapValues(environmentVars, (v) => ((v[0] === '[' && v[v.length - 1] === ']') ? v.replace(/'/g, '').slice(1, -1).split(',') : v));
    const environmentConfigVars = {};
    lodash_1.default.forEach(environmentVars, (v, k) => {
        let value = v;
        if (value === 'true')
            value = true;
        if (value === 'false')
            value = false;
        return object_path_1.default.set(environmentConfigVars, k, value);
    });
    // Merge config files
    const config = lodash_1.default.merge(defaultConfig, environmentConfigVars);
    // read package.json for MEAN.JS project information
    config.package = require(path_1.default.resolve('./package.json'));
    // Initialize global globbed files
    initGlobalConfigFiles(config, assets);
    // Init Secure SSL if can be used
    initSecureMode(config);
    // Print a warning if config.domain is not set
    validateDomainIsSet(config);
    // Expose configuration utilities
    config.utils = {
        getGlobbedPaths,
    };
    return config;
};
/**
 * Set configuration object
 */
exports.default = initGlobalConfig();
//# sourceMappingURL=index.js.map