'use strict';

/**
 * Module dependencies.
 */

const app = require('./lib/app');

app.start().catch(function (e) {
  console.log('server failed: ' + e.message);
  throw (e);
});
