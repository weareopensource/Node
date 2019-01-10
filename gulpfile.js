/**
 * Module dependencies.
 */
const _ = require('lodash');
const glob = require('glob');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const runSequence = require('run-sequence');
const path = require('path');

const plugins = gulpLoadPlugins();
const defaultAssets = require('./config/assets');

let changedTestFiles = [];

// Set NODE_ENV to 'test'
gulp.task('env:test', () => {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', () => {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', () => {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', () => plugins.nodemon({
  script: 'server.js',
  nodeArgs: ['--harmony'],
  ext: 'js,html',
  verbose: true,
  watch: _.union(defaultAssets.views, defaultAssets.allJS, defaultAssets.config),
}));

// Nodemon task without verbosity or debugging
gulp.task('nodemon-debug', () => plugins.nodemon({
  script: 'server.js',
  nodeArgs: ['--harmony', '--debug', '--inspect'],
  ext: 'js,html',
  watch: _.union(defaultAssets.views, defaultAssets.allJS, defaultAssets.config),
}));

// Watch Files For Changes
gulp.task('watch', () => {
  // Start livereload
  plugins.refresh.listen();

  // Add watch rules
  gulp.watch(defaultAssets.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.allJS, ['lint']).on('change', plugins.refresh.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.gulpConfig, ['lint']);
  } else {
    gulp.watch(defaultAssets.gulpConfig, ['lint']);
  }
});

// Watch server test files
gulp.task('watch:server:run-tests', () => {
  // Start livereload
  plugins.refresh.listen();

  // Add Server Test file rules
  gulp.watch([defaultAssets.tests, defaultAssets.allJS], ['test:server']).on('change', (file) => {
    changedTestFiles = [];

    // iterate through server test glob patterns
    _.forEach(defaultAssets.tests, (pattern) => {
      // determine if the changed (watched) file is a server test
      _.forEach(glob.sync(pattern), (f) => {
        const filePath = path.resolve(f);

        if (filePath === path.resolve(file.path)) {
          changedTestFiles.push(f);
        }
      });
    });

    plugins.refresh.changed();
  });
});

// ESLint JS linting task
gulp.task('eslint', () => {
  const assets = _.union(
    defaultAssets.gulpConfig,
    defaultAssets.allJS,
    defaultAssets.tests,
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});


// Mocha tests task
gulp.task('mocha', () => {
  const testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.tests;

  gulp.src(testSuites)
    .pipe(plugins.mocha({
      reporter: 'spec',
      timeout: 10000,
    }))
    .on('error', (err) => {
    // If an error occurs, save it
      console.log(err);
    });
});

// Prepare istanbul coverage test
gulp.task('pre-test', () => gulp.src(defaultAssets.allJS)
  // Covering files
  .pipe(plugins.istanbul())
  // Force `require` to return covered files
  .pipe(plugins.istanbul.hookRequire()));

// Run istanbul test and write report
gulp.task('mocha:coverage', ['pre-test', 'mocha'], () => {
  const testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.tests;

  return gulp.src(testSuites)
    .pipe(plugins.istanbul.writeReports({
      reportOpts: {
        dir: './coverage/server',
      },
    }));
});

// Lint CSS and JavaScript files.
gulp.task('lint', (done) => {
  runSequence('eslint', done);
});

// Run the project tests
gulp.task('test', (done) => {
  runSequence('env:test', 'test:server', done);
});

// Bootstrap the server instance
// Common use case is to run API tests on real instantiated models and db
gulp.task('server:bootstrap', (done) => {
  const app = require('./lib/app');
  app.start().then(() => {
    done();
  });
});

// Connects to Mongoose based on environment settings and seeds the database, performing
// a drop of the mongo database to clear it out
gulp.task('seed:mongoose', (done) => {
  const mongoose = require('./lib/services/mongoose');

  mongoose.connect()
    .then(mongoose.seed)
    .then(mongoose.disconnect)
    .then(() => {
      done();
    });
});

// Connects to an SQL database, drop and re-create the schemas
gulp.task('seed:sequelize', (done) => {
  const sequelize = require('./lib/services/sequelize');

  sequelize.seed()
    .then(() => {
      sequelize.sequelize.close();
      done();
    });
});

// Performs database seeding, used in test environments and related tasks
// gulp.task('test:seed', (done) => {
//   runSequence('seed:mongoose', 'seed:sequelize', done);
// });

gulp.task('test', (done) => {
  runSequence('env:test', 'lint', 'mocha', done);
});

//
// // Watch all server files for changes & run server tests (test:server) task on changes
// gulp.task('test:server:watch', (done) => {
//   runSequence('test:server', 'watch:server:run-tests', done);
// });
//
// gulp.task('test:coverage', (done) => {
//   runSequence('env:test', 'mocha:coverage', done);
// });

// Run the project in development mode
gulp.task('default', (done) => {
  runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', (done) => {
  runSequence('env:dev', ['nodemon-debug', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', (done) => {
  runSequence('env:prod', ['nodemon-nodebug', 'watch'], done);
});
