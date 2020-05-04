/**
 * Module dependencies
 */
const chalk = require('chalk');
const path = require('path');

const mongooseService = require(path.resolve('./lib/services/mongoose'));

/**
 * Work
 */

const purge = async () => {
  try {
    await mongooseService.connect();
    await mongooseService.loadModels();

    const uploadRepository = require(path.resolve('./modules/uploads/repositories/uploads.repository'));
    const result = await uploadRepository.purge('avatar', 'users', 'avatar');
    console.log(chalk.bold.blue(`Uploads purged ${result.deletedCount} avatar`));
  } catch (err) {
    console.log(chalk.bold.red(`Error ${err}`));
  }

  setTimeout(() => {
    console.log(chalk.green('Finish purge of uploads in mongoDB'));
    process.exit(0);
  }, 1000);
};

purge();
