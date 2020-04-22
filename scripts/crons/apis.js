const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');
const cron = require('node-cron');
const mongoose = require('mongoose');

const config = require(path.resolve('./config'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));
const mails = require(path.resolve('./lib/helpers/mails'));

const cronJobs = async () => {
  try {
    console.log(chalk.bold.green('Start CronJobs worker.'));

    await mongooseService.connect();
    await mongooseService.loadModels();
    mongoose.set('debug', false);

    const ScrapService = require(path.resolve('./modules/scraps/services/scraps.service'));
    let scraps = await ScrapService.list();
    scraps = _.remove(scraps, (scrap) => scrap.cron);
    console.log(chalk.green(`Scraps cron list requested: ${scraps.length}`));

    _.forEach(scraps, (_scrap) => {
      if (cron.validate(_scrap.cron)) {
        console.log(chalk.blue(`- Init ${_scrap.title} (${_scrap.id}) : ${_scrap.cron}`));

        cron.schedule(_scrap.cron, async () => {
          console.log(chalk.blue(`- Running ${_scrap.title} (${_scrap.id}) : ${_scrap.cron}`));

          const scrap = await ScrapService.get(_scrap.id);
          const load = await ScrapService.load(scrap);

          if (load.result.type !== 'success' && load.scrap.alert && load.scrap.alert !== '') {
            mails.sendMail({
              template: 'scrap-failed-alert',
              from: config.mailer.from,
              to: load.scrap.alert,
              subject: `Scrap Failed : ${load.scrap.title}`,
              params: {
                result: JSON.stringify(load.result, null, 2),
                scrapTitle: load.scrap.title,
                appName: config.app.title,
                appContact: config.app.appContact,
              },
            });
          }
        });
      }
    });

    console.log(chalk.green(`Scraps cron list Charged: ${scraps.length}`));
  } catch (err) {
    console.log(chalk.bold.red(`Error ${err}`));
  }
};

cronJobs();
