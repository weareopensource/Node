/**
 * Module dependencies.
 */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import _ from 'lodash';
import lusca from 'lusca';
import cors from 'cors';
import cons from 'consolidate';
import morgan from 'morgan';
import logger from './logger';
import config from '../../config/index';

/**
 * Initialize local variables
 */
export function initLocalVariables(app: Application) {
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
}

/**
 * Initialize application middleware
 */
export function initMiddleware(app: Application) {
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
}

/**
 * Invoke modules server configuration
 */
export function initModulesConfiguration(app: Application) {
  try {
    config.files.configs.forEach((configPath) => {
      require(path.resolve(configPath)).default(app);
    });
  } catch (e) {
    console.log(e.stack);
  }
}

/**
 * Configure Helmet headers configuration
 */
export function initHelmetHeaders(app: Application) {
  const SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubDomains: true,
  }));
  app.disable('x-powered-by');
}

/**
 * Configure the modules static routes
 */
export function initModulesClientRoutes(app: Application) {
  app.use('/', express.static(path.resolve('./public'), { maxAge: 86400000 }));
}

/**
 * Configure the modules ACL policies
 */
export function initModulesServerPolicies() {
  try {
    config.files.policies.forEach(async (policyPath) => {
      require(path.resolve(policyPath)).default();
    });
  } catch (e) {
    console.log(e.stack);
  }
}

/**
 * Configure the modules server routes
 */
export function initModulesServerRoutes(app: Application) {
  try {
    config.files.routes.forEach((routePath) => {
      require(path.resolve(routePath)).default(app);
    });
  } catch (e) {
    console.log(e.stack);
  }
  app.get('*', (req, res) => {
    res.send('<center><br /><h1>WAOS Node Api</h1><h3>Available on <a href="/api/tasks">/api</a>. #LetsGetTogether</h3></center>');
  });
}

/**
 * Configure error handling
 */
export function initErrorRoutes(app: Application) {
  app.use((err, req, res, next) => {
    if (!err) return next();
    console.error(err.stack);
    res.status(err.status || 500).send({
      message: err.message,
      code: err.code,
    });
  });
}

/**
 * set rendering Engine
 */
export function setEngine(app: Application) {
  app.engine('html', cons.swig);
  app.set('view engine', 'html');
  app.set('views', path.resolve('config/templates'));
}

/**
 * Initialize the Express application
 */
export function init() {
  // Initialize express app
  const app = express();
  // Initialize local variables
  initLocalVariables(app);
  // Initialize Express middleware
  initMiddleware(app);
  // Initialize Helmet security headers
  initHelmetHeaders(app);
  // Initialize modules static client routes,
  initModulesClientRoutes(app);
  // add lusca csrf
  app.use(lusca(config.csrf));
  // Initialize Modules configuration
  initModulesConfiguration(app);
  // Initialize modules server authorization policies
  initModulesServerPolicies();
  // Initialize modules server routes
  initModulesServerRoutes(app);
  // Initialize error routes
  initErrorRoutes(app);
  // Set engine
  setEngine(app);
  return app;
}
