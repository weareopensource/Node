const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');
const cron = require('node-cron');
const mongoose = require('mongoose');

const mongooseService = require(path.resolve('./lib/services/mongoose'));

const cronJobs = async () => {
  try {
    console.log(chalk.bold.green('Start CronJobs worker.'));

    await mongooseService.connect();
    await mongooseService.loadModels();
    mongoose.set('debug', false);

    const ApiService = require(path.resolve('./modules/apis/services/apis.service'));
    const apis = await ApiService.cron();
    console.log(chalk.green(`Apis cron list requested: ${apis.length}`));

    _.forEach(apis, (_api) => {
      if (cron.validate(_api.cron)) {
        console.log(chalk.blue(`- Init ${_api.title} (${_api.id}) : ${_api.cron}`));

        cron.schedule(_api.cron, async () => {
          console.log(chalk.blue(`- Running ${_api.title} (${_api.id}) : ${_api.cron}`));

          const api = await ApiService.get(_api.id);
          await ApiService.load(api, 'cron');
        });
      }
    });

    console.log(chalk.green(`Apis cron list Charged: ${apis.length}`));
  } catch (err) {
    console.log(chalk.bold.red(`Error ${err}`));
  }
};

cronJobs();
