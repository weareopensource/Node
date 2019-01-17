/**
 * Module dependencies.
 */
const _ = require('lodash');
// const glob = require('glob');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const path = require('path');

const plugins = gulpLoadPlugins();
const defaultAssets = require('./config/assets');

const changedTestFiles = [];

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

// Mocha
const mocha = () => {
  const testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.tests;
  return gulp.src(testSuites)
    .pipe(plugins.mocha({
      reporter: 'spec',
      timeout: 10000,
    }))
    .on('error', (err) => {
    // If an error occurs, save it
      console.log(err);
    });
};
exports.mocha = mocha;

// Watch server test files
const watchMocha = (done) => {
  // Start livereload
  plugins.refresh.listen();

  // Add Server Test file rules
  gulp.watch(_.union(defaultAssets.tests, defaultAssets.allJS), gulp.series(lint, mocha)).on('change', plugins.refresh.changed);
  done();
};
exports.watchMocha = watchMocha;

// Drops the MongoDB database, used in e2e testing by security
const dropdb = (done) => {
  // Use mongoose configuration
  if (process.env.NODE_ENV === 'test') {
    const mongooseService = require(path.resolve('./lib/services/mongoose'));
    mongooseService.connect()
      .then((db) => {
        db.connection.dropDatabase((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Successfully dropped db: ', db.connections[0].name);
          }
          mongooseService.disconnect(done());
        });
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    console.log('db not dropped', process.env.NODE_ENV);
  }
};
exports.dropdb = dropdb;


// // Pre Test 1. Covering files 2. Force `require` to return covered files
// function preTest() {
//   return gulp.src(defaultAssets.allJS)
//     .pipe(plugins.istanbul({
//     // supports es6
//       instrumenter: isparta.Instrumenter,
//     }))
//     .pipe(plugins.istanbul.hookRequire());
// }
// exports.preTest = preTest;


// // Run istanbul test and write report
// const coverage = () => {
//   const testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.tests;

//   return gulp.src(testSuites)
//     .pipe(plugins.istanbul.writeReports({
//       reportOpts: {
//         dir: './coverage',
//       },
//     }));
// };
// exports.coverage = coverage;


// Bootstrap the server instance
// Common use case is to run API tests on real instantiated models and db
const bootstrap = (done) => {
  const app = require('./lib/app');
  app.start().then(() => {
    done();
  });
};
exports.bootstrap = bootstrap;


// TODO seed are currently in rework
// // Connects to Mongoose based on environment settings and seeds the database, performing
// // a drop of the mongo database to clear it out
// gulp.task('seed:mongoose', (done) => {
//   const mongoose = require('./lib/services/mongoose');
//   mongoose.connect()
//     .then(mongoose.seed)
//     .then(mongoose.disconnect)
//     .then(() => {
//       done();
//     });
// });
// // Connects to an SQL database, drop and re-create the schemas
// gulp.task('seed:sequelize', (done) => {
//   const sequelize = require('./lib/services/sequelize');

//   sequelize.seed()
//     .then(() => {
//       sequelize.sequelize.close();
//       done();
//     });
// });
// Performs database seeding, used in test environments and related tasks
// gulp.task('test:seed', (done) => {
//   runSequence('seed:mongoose', 'seed:sequelize', done);
// });

// Run the project tests
const test = gulp.series(lint, mocha, dropdb);
exports.test = test;

// Run the project tests and wtch for changes
const watchTest = gulp.series(lint, mocha, watchMocha);
exports.watchTest = watchTest;

// Run the project tests with coverage TODO Disabled because gulp-istanbul cannot work with gulp-mocha@4.x.x Architectural changes made to gulp-mocha made it stop using files inside the pipe, so it will run your tests, but doesn't work in a gulp way anymore.
// const testCoverage = gulp.series(lint, preTest, mocha, coverage);
// exports.testCoverage = testCoverage;

// Run the project in development mode
const dev = gulp.series(lint, gulp.parallel(nodemon, watch));
exports.default = dev;

// Run the project in debug mode
const debug = gulp.series(lint, gulp.parallel(nodemonDebug, watch));
exports.debug = debug;

// Run the project in production mode
const prod = gulp.series(lint, gulp.parallel(nodemonDebug, watch));
exports.prod = prod;
