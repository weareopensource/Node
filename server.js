/**
 * Module dependencies.
 */

const app = require('./lib/app');

app.start().catch((e) => {
  console.log(`server failed: ${e.message}`);
  throw (e);
});
