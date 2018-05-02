'use strict';

module.exports = function (app) {
  // Tasks controller
  var tasks = require('../controllers/tasks.server.controller');

  // Setting up the models APIs profile api
  // Query actions
  app.route('/api/tasks').get(tasks.getAllTasks);
  app.route('/api/tasks/me').get(tasks.getMyTasks);

  // CRUD actions
  app.route('/api/tasks').post(tasks.addTask);
  app.route('/api/tasks').put(tasks.updateTask);
  app.route('/api/tasks/:id').delete(tasks.deleteTask);

};
