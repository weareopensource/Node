/**
 * Module dependencies
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const bson = require('bson');

const config = require(path.resolve('./config'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));

const exceptions = ['uploads'];

/**
 * Work
 */

const seedData = async () => {
  try {
    console.log(chalk.bold.green('Start Seed Dump by update items if differents'));

    // connect to mongo
    await mongooseService.connect();
    await mongooseService.loadModels();

    let database = config.db.uri.split('/')[config.db.uri.split('/').length - 1];
    database = database.split('?')[0];

    console.log(chalk.bold.green(`database selected: ${database}`));

    fs.readdirSync(path.resolve(`./scripts/db/dump/${database}`)).forEach((file) => {
      if (file.slice(-4) === 'bson' && !exceptions.includes(file.split('.')[0])) {
        const collection = file.slice(0, -5);

        const buffer = fs.readFileSync(path.resolve(`./scripts/db/dump/${database}/${collection}.bson`));
        let bfIdx = 0;
        const items = [];
        while (bfIdx < buffer.length) bfIdx = bson.deserializeStream(buffer, bfIdx, 1, items, items.length);

        const Service = require(path.resolve(`./modules/${collection}/services/${collection}.data.service`));
        Service.import(items, ['_id']);

        console.log(chalk.blue(`Database Seeding ${collection} : ${items.length}`));
      }
    });
  } catch (err) {
    console.log(chalk.bold.red(`Error ${err}`));
  }

  setTimeout(() => {
    console.log(chalk.bold.green('Finish adding items to mongoDB'));
    process.exit(0);
  }, 5000);
};

seedData();
