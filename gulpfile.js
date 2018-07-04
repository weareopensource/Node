

/**
 * Module dependencies.
 */
const _ = require('lodash'),
  fs = require('fs'),
  glob = require('glob'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins(),
  path = require('path');

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

// Copy local development environment config example
gulp.task('copyLocalEnvConfig', () => {
  const src = [];
  const renameTo = 'local-development.js';

  // only add the copy source if our destination file doesn't already exist
  if (!fs.existsSync(`config/env/${renameTo}`)) {
    src.push('config/env/local.example.js');
  }

  return gulp.src(src)
    .pipe(plugins.rename(renameTo))
    .pipe(gulp.dest('config/env'));
});

// Make sure upload directory exists
gulp.task('makeUploadsDir', () => fs.mkdir(`${process.cwd()}/uploads`, (err) => {
  if (err && err.code !== 'EEXIST') {
    console.error(err);
  }
}));

// Mocha tests task
gulp.task('mocha', (done) => {
  // Open mongoose connections
  const mongoose = require('./lib/services/mongoose.js');
  const testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.tests;
  let error;

  // Connect mongoose
  mongoose.connect(() => {
    mongoose.loadModels();
    // Run the tests
    gulp.src(testSuites)
      .pipe(plugins.mocha({
        reporter: 'spec',
        timeout: 10000,
      }))
      .on('error', (err) => {
        // If an error occurs, save it
        error = err;
      })
      .on('end', () => {
        // When the tests are done, disconnect mongoose and pass the error state back to gulp
        mongoose.disconnect(() => {
          done(error);
        });
      });
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

// Launch Ava's integration tests
gulp.task('ava:test:integration', () => gulp.src(defaultAssets.testIntegration)
// gulp-ava needs filepaths so you can't have any plugins before it
  .pipe(plugins.ava({
    verbose: true,
  }))
  .on('error', (err) => {
    // On errors emitted by Ava we display them and exit with a non-zero error code
    // to fail the build
    console.log(err.message);
    process.exit(1);
  })
  .on('end', () => {
    // Because this test depends on `server:bootstrap` which opens an even listener
    // for server connections, it is required to force an exit, otherwise the gulp
    // process will stay open, waiting to process connections due to `server:bootstrap`
    process.exit(0);
  }));

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
gulp.task('test:seed', (done) => {
  runSequence('seed:mongoose', 'seed:sequelize', done);
});

// Run Integration Tests
gulp.task('test:integration', (done) => {
  runSequence('env:test', 'server:bootstrap', 'ava:test:integration', done);
});

gulp.task('test:server', (done) => {
  runSequence('env:test', 'lint', ['copyLocalEnvConfig', 'makeUploadsDir'], 'mocha', done);
});

// Watch all server files for changes & run server tests (test:server) task on changes
gulp.task('test:server:watch', (done) => {
  runSequence('test:server', 'watch:server:run-tests', done);
});

gulp.task('test:coverage', (done) => {
  runSequence('env:test', ['copyLocalEnvConfig', 'makeUploadsDir'], 'mocha:coverage', done);
});

// Run the project in development mode
gulp.task('default', (done) => {
  runSequence('env:dev', ['copyLocalEnvConfig', 'makeUploadsDir'], 'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', (done) => {
  runSequence('env:dev', ['copyLocalEnvConfig', 'makeUploadsDir'], ['nodemon-debug', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', (done) => {
  runSequence(['copyLocalEnvConfig', 'makeUploadsDir'], 'env:prod', ['nodemon-nodebug', 'watch'], done);
});
