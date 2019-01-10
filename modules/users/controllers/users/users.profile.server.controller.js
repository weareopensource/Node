/**
 * Module dependencies
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const IdTokenVerifier = require('idtoken-verifier');
const rp = require('request-promise');

const User = mongoose.model('User');
const errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller'));
const config = require(path.resolve('./config'));
const configuration = require(path.resolve('./config'));
const imageFileFilter = require(path.resolve('./lib/services/multer')).imageFileFilter;
const whitelistedFields = ['firstName', 'lastName', 'email', 'username', 'profileImageURL'];
const {
  OAuth2Client,
} = require('google-auth-library');

/**
 * Update user details
 */
exports.update = (req, res) => {
  // Init Variables
  let user = req.user;
  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updated = Date.now();
    user.displayName = `${user.firstName} ${user.lastName}`;
    User.findByIdAndUpdate(user.id, user, (err) => {
      if (err) {
        res.status(422)
          .send({
            message: errorHandler.getErrorMessage(err),
          });
      } else {
        req.login(user, (errLogin) => {
          if (errLogin) {
            res.status(400)
              .send(errLogin);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(401)
      .send({
        message: 'User is not signed in',
      });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = (req, res) => {
  const user = req.user;
  let existingImageUrl;

  // Filtering to upload only images
  const multerConfig = config.uploads.profile.image;
  multerConfig.fileFilter = imageFileFilter;
  const upload = multer(multerConfig)
    .single('newProfilePicture');
  function uploadImage() {
    return new Promise((resolve, reject) => {
      upload(req, res, (uploadError) => {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateUser() {
    return new Promise((resolve, reject) => {
      user.updated = Date.now();
      user.profileImageURL = config.uploads.profile.image.dest + req.file.filename;

      User.findByIdAndUpdate(user.id, user, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise((resolve, reject) => {
      if (existingImageUrl !== User.schema.path('profileImageURL')
        .defaultValue) {
        fs.unlink(existingImageUrl, (unlinkError) => {
          if (unlinkError) {
            console.log(unlinkError);
            reject(new Error({
              message: 'Error occurred while deleting old profile picture',
            }));
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  function login() {
    return new Promise((resolve) => {
      req.login(user, (err) => {
        if (err) {
          res.status(400)
            .send(err);
        } else {
          resolve();
        }
      });
    });
  }

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(() => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(422)
          .send(err);
      });
  } else {
    res.status(401)
      .send({
        message: 'User is not signed in',
      });
  }
};

/**
 * Send User
 */
exports.me = ({ user }, res) => {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403

  let safeUserObject = null;
  if (user) {
    safeUserObject = {
      id: user.id,
      provider: escape(user.provider),
      username: escape(user.username),
      roles: user.roles,
      profileImageURL: user.profileImageURL,
      email: escape(user.email),
      lastName: escape(user.lastName),
      firstName: escape(user.firstName),
      additionalProvidersData: user.additionalProvidersData,
    };
  }

  res.json(safeUserObject || null);
};


const client = new OAuth2Client(config.google.clientId);

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
  });
  const payload = ticket.getPayload();
  const user = {
    sub: payload.sub,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
    profileImageURL: payload.picture,
  };
  user.username = `${user.firstName} ${user.lastName}`;
  user.provider = 'google';
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return user;
}


const microsoftValidator = rp.get(config.microsoft.discovery)
  .then(res => JSON.parse(res))
  .then(({ jwks_uri: jwksUri }) => new IdTokenVerifier({
    issuer: config.microsoft.issuer,
    jwksURI: jwksUri,
    audience: config.microsoft.clientId,
  }));

async function verifyMicrosoftToken(idToken) {
  const validator = await microsoftValidator;
  return new Promise((resolve, reject) => {
    validator.verify(idToken, validator.decode(idToken)
      .payload.nonce, (err, {
      sub,
      name,
      preferred_username: preferredUsername,
    }) => {
      if (err) {
        return reject(err);
      }
      return resolve({
        sub,
        username: name,
        email: preferredUsername,
        provider: 'microsoft',
      });
    });
  }).catch(console.log);
}

const addGoogleUser = idToken => verifyGoogleToken(idToken)
  .then(user => User.findOneOrCreate({
    sub: user.sub,
  }, user));

const addMicrosoftUser = idToken => verifyMicrosoftToken(idToken)
  .then(user => User.findOneOrCreate({
    sub: user.sub,
  }, user));

exports.addOAuthProviderUserProfile = ({ body }, res) => {
  const provider = body.provider;
  switch (provider) {
    case 'google':
      addGoogleUser(body.idToken)
        .catch(() => res.sendStatus(304))
        .then((user) => {
          const token = jwt.sign({ userId: user.id }, configuration.jwt.secret);
          res.status(200)
            .cookie('TOKEN', token, { httpOnly: true })
            .json({ user: user.toObject({ getters: true }), tokenExpiresIn: Date.now() + (3600 * 24 * 1000) });
        });
      break;
    case 'microsoft':
      addMicrosoftUser(body.idToken)
        .catch(() => res.sendStatus(304))
        .then((user) => {
          const token = jwt.sign({ userId: user.id }, configuration.jwt.secret);
          res.status(200)
            .cookie('TOKEN', token, { httpOnly: true })
            .json({ user: user.toObject({ getters: true }), tokenExpiresIn: Date.now() + (3600 * 24 * 1000) });
        });
      break;
    default:
      res.status(404).send('No Oauth found'); // TODO: Change this into something else
  }
};
