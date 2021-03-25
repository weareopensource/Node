/**
 * Module dependencies.
 */

const chalk = require('chalk');
const app = require('./lib/app');

const server = app.start().catch((e) => {
  console.log(`server failed: ${e.message}`);
  throw e;
});

process.on('SIGINT', () => {
  console.info(chalk.blue(' SIGINT Graceful shutdown ', new Date().toISOString()));
  app.shutdown(server);
});

process.on('SIGTERM', () => {
  console.info(chalk.blue(' SIGTERM Graceful shutdown ', new Date().toISOString()));
  app.shutdown(server);
});
