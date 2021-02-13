/**
 * Module dependencies.
 */
import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import { runCLI } from '@jest/core';
import inquirer from 'inquirer';
import defaultAssets from './config/assets';
import config from './config';
import * as mongooseService from './lib/services/mongoose';
import * as seedService from './lib/services/seed';

const plugins = gulpLoadPlugins();

console.log(defaultAssets);

// default node env if not define
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// ESLint JS
const lint = () => {
  const assets = _.union(
    defaultAssets.gulpConfig,
    // defaultAssets.allJS,
    defaultAssets.tests,
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
};
export { lint };

// Nodemon
const nodemon = (done) => {
  nodemon({
    script: 'server.js',
    nodeArgs: ['--harmony'],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.views, defaultAssets.config),
  });
  done();
};
export { nodemon };

// Nodemon (task without verbosity or debugging)
const nodemonDebug = (done) => {
  nodemon({
    script: 'server.js',
    nodeArgs: ['--harmony', '--debug', '--inspect'],
    ext: 'js,html',
    watch: _.union(defaultAssets.views, defaultAssets.config),
  });
  done();
};
export { nodemonDebug };

// Watch (files For Changes)
const watch = (done) => {
  // Start livereload
  plugins.refresh.listen();
  // Add watch rules
  gulp.watch(defaultAssets.views).on('change', plugins.refresh.changed);
  // gulp.watch(defaultAssets.allJS, gulp.series(lint)).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.gulpConfig, gulp.series(lint));
  done();
};
export { watch };

// Jest UT
const jest = (done) => {
  runCLI(
    {} as any,
    ['.'],
  ).then((result) => {
    if (result.results && result.results.numFailedTests > 0) process.exit();
    done();
  }).catch((e) => {
    console.log(e);
  });
};
export { jest };

// Jest Watch
const jestWatch = (done) => {
  runCLI(
    { watch: true },
    ['.'],
  );
  done();
};
export { jestWatch };

// Jest UT
const jestCoverage = (done) => {
  runCLI(
    {
      collectCoverage: true,
      // collectCoverageFrom: defaultAssets.allJS,
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
export { jestCoverage };

// Drops the MongoDB database, used in e2e testing by security
const dropMongo = async () => {
  const db = await mongooseService.connect();

  await db.connection.dropDatabase();

  await mongooseService.disconnect();
};
export { dropMongo };

// Drop database after confirmation, depends of ENV
const dropDB = async () => {
  if (process.env.NODE_ENV !== 'test') {
    const question = [
      {
        type: 'confirm',
        name: 'continue',
        message: `Do you want really want to dropDB in ${process.env.NODE_ENV} ENV ?(no)`,
        default: false,
      },
    ];

    inquirer.prompt(question).then(async (answer) => {
      if (!answer.continue) return process.exit(2);
      await dropMongo();
    });
  } else await dropMongo();
};
export { dropDB };

// Connects to Mongoose based on environment settings and seeds the database
const seedMongoose = async () => {
  try {
    await mongooseService.connect();
    await seedService.start({
      logResults: true,
    }).catch((e) => {
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
    await mongooseService.connect();
    await mongooseService.loadModels();
    await seedService.userSeed(config.seedDB.options.seedUser).catch((e) => {
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
export { test };

// Run project tests with coverage
const testWatch = gulp.series(dropDB, lint, jestWatch);
export { testWatch };

// Run project tests with coverage
const testCoverage = gulp.series(dropDB, lint, jestCoverage);
export { testCoverage };

// Run Mongoose Seed
const seed = gulp.series(dropDB, seedMongoose);
export { seed };

// Run Mongoose Seed
const seedUser = gulp.series(seedMongooseUser);
export { seedUser };

// Run Mongoose drop
const drop = gulp.series(dropDB);
export { drop };

// Run project in development mode
const dev = gulp.series(lint, gulp.parallel(nodemon, watch));
exports.default = dev;

// Run project in debug mode
const debug = gulp.series(lint, gulp.parallel(nodemonDebug, watch));
export { debug };

// Run project in production mode
const prod = gulp.series(lint, gulp.parallel(nodemonDebug, watch));
export { prod };

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
