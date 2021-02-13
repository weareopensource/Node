/**
 * Module dependencies.
 */

import chalk from 'chalk';
import { start, shutdown } from './lib/app';

const server = start().catch((e) => {
  console.log(`server failed: ${e.message}`);
  throw (e);
});

process.on('SIGINT', () => {
  console.info(chalk.blue(' SIGINT Graceful shutdown ', new Date().toISOString()));
  shutdown(server);
});

process.on('SIGTERM', () => {
  console.info(chalk.blue(' SIGTERM Graceful shutdown ', new Date().toISOString()));
  shutdown(server);
});
