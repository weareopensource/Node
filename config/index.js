'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  chalk = require('chalk'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  objectPath = require('object-path');

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/**
 * Validate NODE_ENV existence
 */
var validateEnvironmentVariable = function () {
  var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
};

/** Validate config.domain is set
 */
var validateDomainIsSet = function (config) {
  if (!config.domain) {
    console.log(chalk.red('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'));
  }
};

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
var validateSecureMode = function (config) {

  if (!config.secure || config.secure.ssl !== true) {
    return true;
  }

  var privateKey = fs.existsSync(path.resolve(config.secure.privateKey));
  var certificate = fs.existsSync(path.resolve(config.secure.certificate));

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
    console.log();
    config.secure.ssl = false;
  }
};

/**
 * Initialize global configuration files
 */
var initGlobalConfigFiles = function (config, assets) {
  // Appending files
  config.files = {};

  // Setting Globbed mongoose model files
  config.files.mongooseModels = getGlobbedPaths(assets.mongooseModels);

  // Setting Globbed sequelize model files
  config.files.sequelizeModels = getGlobbedPaths(assets.sequelizeModels);

  // Setting Globbed route files
  config.files.routes = getGlobbedPaths(assets.routes);

  // Setting Globbed config files
  config.files.configs = getGlobbedPaths(assets.config);

  // Setting Globbed socket files
  config.files.sockets = getGlobbedPaths(assets.sockets);

  // Setting Globbed policies files
  config.files.policies = getGlobbedPaths(assets.policies);

};

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
  // Validate NODE_ENV existence
////  validateEnvironmentVariable();

  // Get the default assets
  var assets = require(path.join(process.cwd(), './config/assets'));

  // Get the current config
  const currentEnv = process.env.NODE_ENV || 'developement';
  var defaultConfig = require(path.join(process.cwd(), './config', 'defaults', currentEnv)) || {};

  // Get the config from  process.env.WAOS_BACK_*
  const environmentVars = _.mapKeys(
    _.pickBy(process.env, (_value, key) => key.startsWith('WAOS_BACK_')),
    (_v, k) => k.split('_').slice(2).join('.')
  );
  const environmentConfigVars = {};
  _.forEach(environmentVars, (v, k) => objectPath.set(environmentConfigVars, k, v));

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfigVars);

  // read package.json for MEAN.JS project information
  var pkg = require(path.resolve('./package.json'));
  config.meanjs = pkg;

  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  // config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {});

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Validate Secure SSL mode can be used
  validateSecureMode(config);

  // Print a warning if config.domain is not set
  validateDomainIsSet(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
