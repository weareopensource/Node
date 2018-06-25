'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  config = require(path.resolve('./config')),
  errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  jwt = require('jsonwebtoken'),
  configuration = require(path.resolve('./config')),
  UserService = require('../../services/user.service');

const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = (req, res, next) => {
  async.waterfall([
    done => {
      if (req.body.email) {
        User.findOne({
          email: req.body.email
        }, '-salt -password', (err, user) => {
          if (err || !user) {
            return res.status(400).send({
              message: 'No account with that email has been found'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {
            const payload = { exp: Date.now() + 3600000 };
            const token = jwt.sign(payload, configuration.jwt.secret, { algorithm: 'HS256' });

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(err => {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Username field must not be blank'
        });
      }
    },
    (token, user, done) => {
      let httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      //      const baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      const baseUrl = httpTransport + config.host + ':4200';
      res.render('reset-password-email', {
        name: user.displayName,
        appName: config.app.title,
        url: baseUrl + '/auth/password-reset?token=' + token
      }, (err, emailHTML) => {
        done(err, emailHTML, user);
      });
    },
    (emailHTML, user, done) => {

      const mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, err => {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], err => {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, (err, user) => {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = (req, res, next) => {
  // Init Variables
  const newPassword = req.body.newPassword;
  const resetPasswordToken = req.body.token;

  async.waterfall([
    done => {
      UserService.hashPassword(newPassword)
        .then(password => {
          done(null, password);
        })
        .catch(e => {
          console.log(e);
          done(e);
        });
    },
    (password, done) => {
      User.findOne({
        resetPasswordToken,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, (err, user) => {
        if (!err && user) {
          user.password = password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(err => {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.login(user, err => {
                if (err) {
                  res.status(400).send(err);
                } else {
                  // Remove sensitive data before return authenticated user
                  user.password = undefined;
                  user.salt = undefined;

                  res.json(user);

                  done(err, user);
                }
              });
            }
          });
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    (user, done) => {
      res.render('reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, (err, emailHTML) => {
        done(err, emailHTML, user);
      });
    },
    (emailHTML, user, done) => {
      const mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, err => {
        done(err, 'done');
      });
    }
  ], err => {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = (req, res) => {
  // Init Variables
  const passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, (err, user) => {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(err => {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, err => {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(422).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};
