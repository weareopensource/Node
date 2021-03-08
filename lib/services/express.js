/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const _ = require('lodash');
const lusca = require('lusca');
const cors = require('cors');
const cons = require('consolidate');
const morgan = require('morgan');
const fs = require('fs');
const YAML = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const logger = require('./logger');
const config = require('../../config');

/**
 * Initialize Swagger
 */
module.exports.initSwagger = (app) => {
  if (config.swagger.enable) {
    // Merge files.
    try {
      const contents = config.files.swagger.map((filePath) => YAML.load(fs.readFileSync(filePath).toString()));
      const merged = contents.reduce(_.merge);
      fs.writeFile('./public/swagger.yml', YAML.dump(merged), (error) => {
        if (error) {
          throw error;
        }
      });
    } catch (e) {
      throw new Error(e);
    }

    app.use(config.swagger.options.swaggerUrl, express.static('./public/swagger.yml'));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(null, config.swagger.options));
  }
};

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = (app) => {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) app.locals.secure = config.secure.ssl;
  app.locals.keywords = config.app.keywords;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;
  // Passing the request url to environment locals
  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = (app) => {
  // Should be placed before express.static
  app.use(compress({
    filter(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9,
  }));
  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format') && process.env.NODE_ENV !== 'test') {
    morgan.token('id', (req) => _.get(req, 'user.id') || 'Unknown id');
    morgan.token('email', (req) => _.get(req, 'user.email') || 'Unknown email');
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }
  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(cors({
    origin: config.cors.origin || [],
    credentials: config.cors.credentials || false,
    optionsSuccessStatus: config.cors.optionsSuccessStatus || 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = (app) => {
  config.files.configs.forEach((configPath) => {
    require(path.resolve(configPath))(app);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = (app) => {
  const SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubDomains: true,
    force: true,
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = (app) => {
  app.use('/', express.static(path.resolve('./public'), { maxAge: 86400000 }));
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = () => {
  config.files.policies.forEach((policyPath) => {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = (app) => {
  config.files.routes.forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });
  app.get('*', (req, res) => {
    res.send('<center><br /><h1>WAOS Node Api</h1><h3>Available on <a href="/api/tasks">/api</a>. #LetsGetTogether</h3></center>');
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = (app) => {
  app.use((err, req, res, next) => {
    if (!err) return next();
    console.error(err.stack);
    res.status(err.status || 500).send({
      message: err.message,
      code: err.code,
    });
  });
};

/**
 * set rendering Engine
 */
module.exports.setEngine = (app) => {
  app.engine('html', cons.swig);
  app.set('view engine', 'html');
  app.set('views', path.resolve('config/templates'));
};

/**
 * Initialize the Express application
 */
module.exports.init = function init() {
  // Initialize express app
  const app = express();
  // Initialize modules swagger doc
  this.initSwagger(app);
  // Initialize local variables
  this.initLocalVariables(app);
  // Initialize Express middleware
  this.initMiddleware(app);
  // Initialize Helmet security headers
  this.initHelmetHeaders(app);
  // Initialize modules static client routes,
  this.initModulesClientRoutes(app);
  // add lusca csrf
  app.use(lusca(config.csrf));
  // Initialize Modules configuration
  this.initModulesConfiguration(app);
  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);
  // Initialize modules server routes
  this.initModulesServerRoutes(app);
  // Initialize error routes
  this.initErrorRoutes(app);
  // Set engine
  this.setEngine(app);
  return app;
};
