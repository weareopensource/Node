/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const hbs = require('express-hbs');
const path = require('path');
const _ = require('lodash');
const lusca = require('lusca');
const cors = require('cors');
const cons = require('consolidate');
const expressLogger = require('./logger').logExpress();
const log = require('./logger').log();
const config = require('../../config');
/**
 * Initialize local variables
 */
module.exports.initLocalVariables = (app) => {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
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

  app.use(expressLogger);

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());

  app.use(cors({
    origin: [config.cors.url],
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
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
  // Use helmet to secure Express headers
  const SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true,
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = (app) => {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public'), { maxAge: 86400000 }));
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = (app) => {
  // Globbing policy files
  config.files.policies.forEach((policyPath) => {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = (app) => {
  // Globbing routing files
  config.files.routes.forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });
  app.get('*', (req, res, next) => {
    res.sendFile(path.resolve('./public/index.html'));
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = (app) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Build an error response object and send it with the
    // status in the error
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
  app.set('views', path.resolve('modules/users/templates'));
};

/**
 * Initialize the Express application
 */
module.exports.init = function () {
  // Initialize express app
  const app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes,
  this.initModulesClientRoutes(app);

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
