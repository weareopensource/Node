"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.setEngine = exports.initErrorRoutes = exports.initModulesServerRoutes = exports.initModulesServerPolicies = exports.initModulesClientRoutes = exports.initHelmetHeaders = exports.initModulesConfiguration = exports.initMiddleware = exports.initLocalVariables = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies.
 */
const express_1 = tslib_1.__importDefault(require("express"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const method_override_1 = tslib_1.__importDefault(require("method-override"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const path_1 = tslib_1.__importDefault(require("path"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const lusca_1 = tslib_1.__importDefault(require("lusca"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const consolidate_1 = tslib_1.__importDefault(require("consolidate"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const logger_1 = tslib_1.__importDefault(require("./logger"));
const config_1 = tslib_1.__importDefault(require("../../config"));
/**
 * Initialize local variables
 */
function initLocalVariables(app) {
    // Setting application local variables
    app.locals.title = config_1.default.app.title;
    app.locals.description = config_1.default.app.description;
    if (config_1.default.secure && config_1.default.secure.ssl === true)
        app.locals.secure = config_1.default.secure.ssl;
    app.locals.keywords = config_1.default.app.keywords;
    app.locals.env = process.env.NODE_ENV;
    app.locals.domain = config_1.default.domain;
    // Passing the request url to environment locals
    app.use((req, res, next) => {
        res.locals.host = `${req.protocol}://${req.hostname}`;
        res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
        next();
    });
}
exports.initLocalVariables = initLocalVariables;
/**
 * Initialize application middleware
 */
function initMiddleware(app) {
    // Should be placed before express.static
    app.use(compression_1.default({
        filter(req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9,
    }));
    // Enable logger (morgan) if enabled in the configuration file
    if (lodash_1.default.has(config_1.default, 'log.format') && process.env.NODE_ENV !== 'test') {
        morgan_1.default.token('id', (req) => lodash_1.default.get(req, 'user.id') || 'Unknown id');
        morgan_1.default.token('email', (req) => lodash_1.default.get(req, 'user.email') || 'Unknown email');
        app.use(morgan_1.default(logger_1.default.getLogFormat(), logger_1.default.getMorganOptions()));
    }
    // Request body parsing middleware should be above methodOverride
    app.use(body_parser_1.default.urlencoded({
        extended: true,
    }));
    app.use(body_parser_1.default.json());
    app.use(method_override_1.default());
    // Add the cookie parser and flash middleware
    app.use(cookie_parser_1.default());
    app.use(cors_1.default({
        origin: config_1.default.cors.origin || [],
        credentials: config_1.default.cors.credentials || false,
        optionsSuccessStatus: config_1.default.cors.optionsSuccessStatus || 200,
    }));
}
exports.initMiddleware = initMiddleware;
/**
 * Invoke modules server configuration
 */
function initModulesConfiguration(app) {
    config_1.default.files.configs.forEach((configPath) => {
        require(path_1.default.resolve(configPath))(app);
    });
}
exports.initModulesConfiguration = initModulesConfiguration;
/**
 * Configure Helmet headers configuration
 */
function initHelmetHeaders(app) {
    const SIX_MONTHS = 15778476000;
    app.use(helmet_1.default.frameguard());
    app.use(helmet_1.default.xssFilter());
    app.use(helmet_1.default.noSniff());
    app.use(helmet_1.default.ieNoOpen());
    app.use(helmet_1.default.hsts({
        maxAge: SIX_MONTHS,
        includeSubDomains: true,
    }));
    app.disable('x-powered-by');
}
exports.initHelmetHeaders = initHelmetHeaders;
/**
 * Configure the modules static routes
 */
function initModulesClientRoutes(app) {
    app.use('/', express_1.default.static(path_1.default.resolve('./public'), { maxAge: 86400000 }));
}
exports.initModulesClientRoutes = initModulesClientRoutes;
/**
 * Configure the modules ACL policies
 */
function initModulesServerPolicies() {
    config_1.default.files.policies.forEach((policyPath) => {
        require(path_1.default.resolve(policyPath)).invokeRolesPolicies();
    });
}
exports.initModulesServerPolicies = initModulesServerPolicies;
/**
 * Configure the modules server routes
 */
function initModulesServerRoutes(app) {
    config_1.default.files.routes.forEach((routePath) => {
        require(path_1.default.resolve(routePath))(app);
    });
    app.get('*', (req, res) => {
        res.send('<center><br /><h1>WAOS Node Api</h1><h3>Available on <a href="/api/tasks">/api</a>. #LetsGetTogether</h3></center>');
    });
}
exports.initModulesServerRoutes = initModulesServerRoutes;
/**
 * Configure error handling
 */
function initErrorRoutes(app) {
    app.use((err, req, res, next) => {
        if (!err)
            return next();
        console.error(err.stack);
        res.status(err.status || 500).send({
            message: err.message,
            code: err.code,
        });
    });
}
exports.initErrorRoutes = initErrorRoutes;
/**
 * set rendering Engine
 */
function setEngine(app) {
    app.engine('html', consolidate_1.default.swig);
    app.set('view engine', 'html');
    app.set('views', path_1.default.resolve('config/templates'));
}
exports.setEngine = setEngine;
/**
 * Initialize the Express application
 */
function init() {
    // Initialize express app
    const app = express_1.default();
    // Initialize local variables
    initLocalVariables(app);
    // Initialize Express middleware
    initMiddleware(app);
    // Initialize Helmet security headers
    initHelmetHeaders(app);
    // Initialize modules static client routes,
    initModulesClientRoutes(app);
    // add lusca csrf
    app.use(lusca_1.default(config_1.default.csrf));
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
exports.init = init;
//# sourceMappingURL=express.js.map