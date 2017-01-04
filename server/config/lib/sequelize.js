'use strict';

/**
 * Module dependencies.
 */
const config = require('../config'),
  path = require('path'),
  Sequelize = require('sequelize');

var orm = {};
var sequelize;

// Only read config.orm if it is defined, if not just return empty orm object
if (config.orm) {

  // Instantiate a sequelize connection to an SQL database based on configuration
  // from `server/config/env/*`
  try {
    sequelize = new Sequelize(config.orm.dbname, config.orm.user, config.orm.pass, config.orm.options);
  } catch (e) {
    throw new Error(e);
  }

  // Instantiate sequelize models
  config.files.server.sequelizeModels.forEach(function (modelPath) {
    try {
      let model = sequelize.import(path.resolve(modelPath));
      orm[model.name] = model;
    } catch (e) {
      throw new Error(e);
    }
  });

  // Once all models have been loaded, establish the associations between them
  Object.keys(orm).forEach(function (modelName) {
    if (orm[modelName].associate) {
      orm[modelName].associate(orm);
    }
  });

  // Expose the instantiated sequelize connection object
  orm.sequelize = sequelize;

  // Expose the global Sequelize library
  orm.Sequelize = Sequelize;

  orm.sync = function () {
    // Sync makes sure the database tables are created if they don't exist
    return this.sequelize.sync({
      force: (config.seedDB.reset || false)
    });
  };

  orm.seed = function () {
    // Sync makes sure the database tables are created if they don't exist
    // and the `force` parameter will also drop the tables before re-creating them
    return this.sequelize.sync({ force: true });
  };

}

// Export this ORM module
module.exports = orm;
