'use strict'

const passport = require('passport')

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(users.signup)
  app.route('/api/auth/signin').post(passport.authenticate('local'), users.signin)
  app.route('/api/auth/signout').post(users.signout)

  // Jwt token
  app.route('/api/auth/token').post(users.token)
  // Jwt protected route example:
  // app.route('/api/auth/secretPlace').get(passport.authenticate('jwt'), (req, res) => {
  //   console.log(req.user)
  //   console.log(req.session)
  //   console.log(req.isAuthenticated())
  //   res.status(200).send()
  // })

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall)
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback)
}
