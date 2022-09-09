/**
 * Module dependencies.
 */
import _ from "lodash";
// import glob from "glob";
import gulp from "gulp";
import gugulpLoadPluginslp from "gulp-load-plugins";
import path from "path";
import { runCLI } from "@jest/core";
import inquirer from "inquirer";

const plugins = gulpLoadPlugins();

import defaultAssets from "./config/assets.js"
import config from "./config/index.js";

// default node env if not define
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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

// Watch (files For Changes)
const watch = (done) => {
  // Start livereload
  plugins.refresh.listen();
  // Add watch rules
  gulp.watch(defaultAssets.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.allJS).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.gulpConfig);
  done();
};

// Jest UT
const jest = (done) => {
  runCLI({}, ['.'])
    .then((result) => {
      if (result.results && result.results.numFailedTests > 0) process.exit();
      done();
    })
    .catch((e) => {
      console.log(e);
    });
};

// Jest Watch
const jestWatch = (done) => {
  runCLI({ watch: true }, ['.']);
  done();
};

// Jest UT
const jestCoverage = (done) => {
  runCLI(
    {
      collectCoverage: true,
      collectCoverageFrom: defaultAssets.allJS,
      coverageDirectory: 'coverage',
      coverageReporters: ['json', 'lcov', 'text'],
    },
    ['.'],
  )
    .then((result) => {
      if (result.results && result.results.numFailedTests > 0) process.exit();
      done();
    })
    .catch((e) => {
      console.log(e);
    });
};

// Drops the MongoDB database, used in e2e testing by security
const dropMongo = async (done) => {
  const mongooseService = await import(path.resolve('./lib/services/mongoose.js'));
  mongooseService
    .connect()
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
      dropMongo(done);
    });
  } else dropMongo(done);
};

// Connects to Mongoose based on environment settings and seeds the database
const seedMongoose = async () => {
  try {
    const mongooseService = await import(path.resolve('./lib/services/mongoose.js'));
    await mongooseService.connect();
    await mongooseService.loadModels();
    const AuthService = await import(path.resolve('./modules/auth/services/auth.service.js'));
    const UserService = await import(path.resolve('./modules/users/services/user.service.js'));
    const TaskService = await import(path.resolve('./modules/tasks/services/tasks.service.js'));
    const seed = await import(path.resolve('./lib/services/seed.js'));
    await seed
      .start(
        {
          logResults: true,
        },
        UserService,
        AuthService,
        TaskService,
      )
      .catch((e) => {
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
    const mongooseService = await import(path.resolve('./lib/services/mongoose.js'));
    await mongooseService.connect();
    await mongooseService.loadModels();
    const AuthService = await import(path.resolve('./modules/auth/services/auth.service.js'));
    const UserService = await import(path.resolve('./modules/users/services/user.service.js'));
    const seed = await import(path.resolve('./lib/services/seed.js'));
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
const test = gulp.series(dropDB, jest);

// Run project tests with coverage
const testWatch = gulp.series(dropDB, jestWatch);

// Run project tests with coverage
const testCoverage = gulp.series(dropDB, jestCoverage);

// Run Mongoose Seed
const seed = gulp.series(dropDB, seedMongoose);

// Run Mongoose Seed
const seedUser = gulp.series(seedMongooseUser);

// Run Mongoose drop
const drop = gulp.series(dropDB);

// Run project in development mode
const dev = gulp.series(gulp.parallel(nodemon, watch));

// Run project in debug mode
const debug = gulp.series(gulp.parallel(nodemonDebug, watch));

// Run project in production mode
const prod = gulp.series(gulp.parallel(nodemonDebug, watch));

export default {
  test,
  testWatch,
  testCoverage,
  seed,
  seedUser,
  drop,
  dev,
  debug,
  prod
}