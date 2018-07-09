/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

/**
 * User Schema
 */
const UserSchema = new Schema({
  sub: {
    type: String,
    default: '',
  },
  firstName: {
    type: String,
    trim: true,
    default: '',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
  },
  displayName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true,
    },
    lowercase: true,
    trim: true,
    default: '',
  },
  username: {
    type: String,
    required: 'Please fill in a username',
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: '',
  },
  salt: {
    type: String,
  },
  profileImageURL: {
    type: String,
    default: 'assets/ic_profile.png',
  },
  provider: {
    type: String,
    required: 'Provider is required',
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin'],
    }],
    default: ['user'],
    required: 'Please provide at least one role',
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  /* For reset password */
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = password => this.password === this.hashPassword(password);

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = (username, suffix, callback) => {
  const that = this;
  const possibleUsername = username.toLowerCase() + (suffix || '');

  that.findOne({
    username: possibleUsername,
  }, (err, user) => {
    if (!err) {
      if (!user) {
        return callback(possibleUsername);
      }
      return that.findUniqueUsername(username, (suffix || 0) + 1, callback);
    }
    return callback(null);
  });
};

UserSchema.static('findOneOrCreate', async (condition, doc) => {
  const one = await this.findOne(condition);
  return one || this.create(doc).then((document) => {
    console.log('docteur', document);
    return document;
  }).catch((err) => {
    console.log(err);
    return Promise.resolve(doc);
  });
});

mongoose.model('User', UserSchema);
