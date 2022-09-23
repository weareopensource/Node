/**
 * Module dependencies
 */
import chalk from "chalk";
import path from "path";

import mongooseService from "../../lib/services/mongoose";

/**
 * Work
 */

const purge = async () => {
  try {
    await mongooseService.connect();
    await mongooseService.loadModels();

    const uploadRepository = await import(path.resolve('./modules/uploads/repositories/uploads.repository.js'));
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
