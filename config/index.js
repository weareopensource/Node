/**
 * Module dependencies.
 */
import _ from "lodash";
import chalk from "chalk";
import glob from "glob";
import fs from "fs";
import path from "path";
import objectPath from "object-path";
import assets from "./assets.js"; 


/**
 * Get files by glob patterns
 */
const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  /* eslint no-useless-escape:0 */
  const urlRegex = /^(?:[a-z]+:)?\/\//i;
  let output = [];
  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns.replace(/\\/g, '/'));
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
const initGlobalConfigFiles = (assets) => {
  const files = {}; // Appending files
  files.swagger = getGlobbedPaths(assets.allYaml); // Setting Globbed module yaml files
  files.mongooseModels = getGlobbedPaths(assets.mongooseModels); // Setting Globbed mongoose model files
  files.sequelizeModels = getGlobbedPaths(assets.sequelizeModels); // Setting Globbed sequelize model files
  files.routes = getGlobbedPaths(assets.routes); // Setting Globbed route files
  files.configs = getGlobbedPaths(assets.config); // Setting Globbed config files
  // files.sockets = getGlobbedPaths(assets.sockets); // Setting Globbed socket files
  files.policies = getGlobbedPaths(assets.policies); // Setting Globbed policies files
  return files;
};

/**
 * Initialize global configuration
 */

const initGlobalConfig = async () => {
  // Get the current config
  const _path = path.join(process.cwd(), './config', 'defaults', `${process.env.NODE_ENV}.js` || 'development.js');
  let defaultConfig;
  if (fs.existsSync(`${_path}`)) defaultConfig = await import(_path);
  else {
    console.error(chalk.red(`+ Error: No configuration file found for "${process.env.NODE_ENV}" environment using development instead. (${_path})`));
    defaultConfig = await import(path.join(process.cwd(), './config', 'defaults', 'development.js'));
  }
  // Get the config from  process.env.WAOS_NODE_*
  let environmentVars = _.mapKeys(
    _.pickBy(process.env, (_value, key) => key.startsWith('WAOS_NODE_')),
    (_v, k) => k.split('_').slice(2).join('.'),
  );
  // convert string array from sys  to real array
  environmentVars = _.mapValues(environmentVars, (v) => (v[0] === '[' && v[v.length - 1] === ']' ? v.replace(/'/g, '').slice(1, -1).split(',') : v));
  const environmentConfigVars = {};
  _.forEach(environmentVars, (v, k) => {
    let value = v;
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    return objectPath.set(environmentConfigVars, k, value);
  });
  // Merge config files
  const config = _.merge(defaultConfig.default, environmentConfigVars);
  // read package.json for project information
  _.merge(config, { package: await import(path.resolve('./package.json'), { assert: { type: "json" } }) });
  // Initialize global globbed files
  _.merge(config, { files: initGlobalConfigFiles(assets) });
  // Init Secure SSL if can be used
  initSecureMode(config);
  // Print a warning if config.domain is not set
  validateDomainIsSet(config);
  // Expose configuration utilities
  const conf = Object.assign({}, config);
  conf.utils = {
    getGlobbedPaths,
  };
  return conf;
};

export default await initGlobalConfig()
