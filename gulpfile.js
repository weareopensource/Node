/**
 * Module dependencies.
 */
const _ = require('lodash');
// const glob = require('glob');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const path = require('path');
const { runCLI } = require('@jest/core');
const inquirer = require('inquirer');

const plugins = gulpLoadPlugins();
const defaultAssets = require('./config/assets');

const config = require(path.resolve('./config'));

// default node env if not define
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// ESLint JS
const lint = () => {
  const assets = _.union(
    defaultAssets.gulpConfig,
    defaultAssets.allJS,
    defaultAssets.tests,
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
};
exports.lint = lint;

// Nodemon
const nodemon = (done) => {
  plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--harmony'],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.views, defaultAssets.allJS, defaultAssets.config),
  });
  done();
};
exports.nodemon = nodemon;

// Nodemon (task without verbosity or debugging)
const nodemonDebug = (done) => {
  plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--harmony', '--debug', '--inspect'],
    ext: 'js,html',
    watch: _.union(defaultAssets.views, defaultAssets.allJS, defaultAssets.config),
  });
  done();
};
exports.nodemonDebug = nodemonDebug;

// Watch (files For Changes)
const watch = (done) => {
  // Start livereload
  plugins.refresh.listen();
  // Add watch rules
  gulp.watch(defaultAssets.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.allJS, gulp.series(lint)).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.gulpConfig, gulp.series(lint));
  done();
};
exports.watch = watch;

// Jest UT
const jest = (done) => {
  runCLI(
    {},
    ['.'],
  ).then((result) => {
    if (result.results && result.results.numFailedTests > 0) process.exit();
    done();
  }).catch((e) => {
    console.log(e);
  });
};
exports.jest = jest;

// Jest Watch
const jestWatch = (done) => {
  runCLI(
    { watch: true },
    ['.'],
  );
  done();
};
exports.jestWatch = jestWatch;

// Jest UT
const jestCoverage = (done) => {
  runCLI(
    {
      collectCoverage: true,
      collectCoverageFrom: defaultAssets.allJS,
      coverageDirectory: 'coverage',
      coverageReporters: [
        'json',
        'lcov',
        'text',
      ],
    },
    ['.'],
  ).then((result) => {
    if (result.results && result.results.numFailedTests > 0) process.exit();
    done();
  }).catch((e) => {
    console.log(e);
  });
};
exports.jestCoverage = jestCoverage;

// Drops the MongoDB database, used in e2e testing by security
const dropMongo = (done) => {
  const mongooseService = require(path.resolve('./lib/services/mongoose'));
  mongooseService.connect()
    .then((db) => {
      db.connection.dropDatabase((err) => {
        if (err) console.error(err);
        else console.log('Successfully dropped db: ', db.connections[0].name);
        mongooseService.disconnect(done());
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
exports.dropMongo = dropMongo;

// Drop database after confirmation, depends of ENV
const dropDB = (done) => {
  if (process.env.NODE_ENV !== 'test') {
    const question = [
      {
        type: 'confirm',
        name: 'continue',
        message: `Do you want really want to dropDB in ${process.env.NODE_ENV} ENV ?(no)`,
        default: false,
      },
    ];

    inquirer.prompt(question).then((answer) => {
      if (!answer.continue) return process.exit(2);
      this.dropMongo(done);
    });
  } else this.dropMongo(done);
};
exports.dropDB = dropDB;

// Connects to Mongoose based on environment settings and seeds the database
const seedMongoose = async () => {
  try {
    const mongooseService = require(path.resolve('./lib/services/mongoose'));
    await mongooseService.connect();
    await mongooseService.loadModels();
    const AuthService = require(path.resolve('./modules/auth/services/auth.service'));
    const UserService = require(path.resolve('./modules/users/services/user.service'));
    const TaskService = require(path.resolve('./modules/tasks/services/tasks.service'));
    const seed = require(path.resolve('./lib/services/seed'));
    await seed.start({
      logResults: true,
    }, UserService, AuthService, TaskService).catch((e) => {
      console.log(e);
    });
    await mongooseService.disconnect();
  } catch (err) {
    console.log(err);
  }
};

// Connects to Mongoose based on environment settings and seeds the database
const seedMongooseUser = async () => {
  try {
    const mongooseService = require(path.resolve('./lib/services/mongoose'));
    await mongooseService.connect();
    await mongooseService.loadModels();
    const AuthService = require(path.resolve('./modules/auth/services/auth.service'));
    const UserService = require(path.resolve('./modules/users/services/user.service'));
    const seed = require(path.resolve('./lib/services/seed'));
    await seed.user(config.seedDB.options.seedUser, UserService, AuthService).catch((e) => {
      console.log(e);
    });
    await mongooseService.disconnect();
  } catch (err) {
    console.log(err);
  }
};

// Connects to an SQL database, drop and re-create the schemas
// gulp.task('seed:sequelize', (done) => {
//   const sequelize = require('./lib/services/sequelize');
//   sequelize.seed()
//     .then(() => {
//       sequelize.sequelize.close();
//       done();
//     });
// });

// Run project tests
const test = gulp.series(dropDB, lint, jest);
exports.test = test;

// Run project tests with coverage
const testWatch = gulp.series(dropDB, lint, jestWatch);
exports.testWatch = testWatch;

// Run project tests with coverage
const testCoverage = gulp.series(dropDB, lint, jestCoverage);
exports.testCoverage = testCoverage;

// Run Mongoose Seed
const seed = gulp.series(dropDB, seedMongoose);
exports.seed = seed;

// Run Mongoose Seed
const seedUser = gulp.series(seedMongooseUser);
exports.seedUser = seedUser;

// Run Mongoose drop
const drop = gulp.series(dropDB);
exports.drop = drop;

// Run project in development mode
const dev = gulp.series(lint, gulp.parallel(nodemon, watch));
exports.default = dev;

// Run project in debug mode
const debug = gulp.series(lint, gulp.parallel(nodemonDebug, watch));
exports.debug = debug;

// Run project in production mode
const prod = gulp.series(lint, gulp.parallel(nodemonDebug, watch));
exports.prod = prod;

/**
 * Examples for Mocha TODO : switch in readme
 */

// Example Mocha example
// const changedTestFiles = [];
// const mocha = () => {
//   const testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.tests;
//   return gulp.src(testSuites)
//     .pipe(plugins.mocha({
//       reporter: 'spec',
//       timeout: 10000,
//     }))
//     .on('error', (err) => {
//     // If an error occurs, save it
//       console.log(err);
//     });
// };
// exports.mocha = mocha;

// Example Watch server test files
// const watchMocha = (done) => {
//   // Start livereload
//   plugins.refresh.listen();

//   // Add Server Test file rules
//   gulp.watch(_.union(defaultAssets.tests, defaultAssets.allJS), gulp.series(lint, mocha)).on('change', plugins.refresh.changed);
//   done();
// };
// exports.watchMocha = watchMocha;

// Example Bootstrap the server instance
// Common use case is to run API tests on real instantiated models and db
// const bootstrap = (done) => {
//   const app = require('./lib/app');
//   app.start().then(() => {
//     done();
//   });
// };
// exports.bootstrap = bootstrap;
