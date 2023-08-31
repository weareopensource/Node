/**
 * Module dependencies.
 */
import _ from 'lodash';
import chalk from 'chalk';
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

/**
 * Get files by glob patterns
 */
const getGlobbedPaths = async (globPatterns, excludes) => {
  // URL paths regex
  /* eslint no-useless-escape:0 */
  const urlRegex = /^(?:[a-z]+:)?\/\//i;
  let output = [];
  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(async (globPattern) => {
      output = _.union(output, await getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = await glob.sync(globPatterns.replace(/\\/g, '/'));
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            excludes((exlude) => {
              file = file.replace(exlude, '');
            });
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

/** Validate config.domain is set
 */
const validateDomainIsSet = (config) => {
  if (!config.domain) {
    console.log(chalk.red('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'));
  }
};

/**
 * validate secure parameters and create credentials in consequence value for ssl
 * @param config
 */
const initSecureMode = (config) => {
  if (!config.secure || config.secure.ssl !== true) return true;

  const key = fs.existsSync(path.resolve(config.secure.key));
  const cert = fs.existsSync(path.resolve(config.secure.cert));

  if (!key || !cert) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
    console.log();
    config.secure.ssl = false;
  } else {
    config.secure.credentials = {
      key: fs.readFileSync(path.resolve(config.secure.key)),
      cert: fs.readFileSync(path.resolve(config.secure.cert)),
    };
  }
};

/**
 * Initialize global configuration files
 */
const initGlobalConfigFiles = async (assets) => {
  const files = {}; // Appending files
  files.swagger = await getGlobbedPaths(assets.allYaml); // Setting Globbed module yaml files
  files.mongooseModels = await getGlobbedPaths(assets.mongooseModels); // Setting Globbed mongoose model files
  files.sequelizeModels = await getGlobbedPaths(assets.sequelizeModels); // Setting Globbed sequelize model files
  files.routes = await getGlobbedPaths(assets.routes); // Setting Globbed route files
  files.configs = await getGlobbedPaths(assets.config); // Setting Globbed config files
  // files.sockets = getGlobbedPaths(assets.sockets); // Setting Globbed socket files
  files.policies = await getGlobbedPaths(assets.policies); // Setting Globbed policies files
  return files;
};

export default {
  getGlobbedPaths,
  validateDomainIsSet,
  initSecureMode,
  initGlobalConfigFiles,
};
