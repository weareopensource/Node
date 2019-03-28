/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

/**
 * User Schema
 */
const UserMongoose = new Schema({
  sub: String,
  firstName: String,
  lastName: String,
  displayName: String,
  email: {
    type: String,
    unique: 'Email already exists',
  },
  username: {
    type: String,
    unique: 'Username already exists',
  },
  profileImageURL: String,
  roles: [],
  /* Extra */
  updated: Date,
  created: Date,
  /* Provider */
  provider: String,
  providerData: {},
  additionalProvidersData: {},
  /* Password */
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// add virtual id field (FIXME mongoose.virtual ko es6)
function addID() {
  return this._id.toHexString();
}
UserMongoose.virtual('id').get(addID);

// Ensure virtual fields are serialised.
UserMongoose.set('toJSON', {
  virtuals: true,
});

/**
 * Create instance method for authenticating user
 */
// UserMongoose.methods.authenticate = password => this.password === this.hashPassword(password);


// UserMongoose.static('findOneOrCreate', async (condition, doc) => {
//   const one = await this.findOne(condition);
//   return one || this.create(doc).then((document) => {
//     console.log('docteur', document);
//     return document;
//   }).catch((err) => {
//     console.log(err);
//     return Promise.resolve(doc);
//   });
// });

mongoose.model('User', UserMongoose);
