/**
 * Module dependencies
 */
import mongoose from 'mongoose';

mongoose.Promise = Promise;

export interface IUser extends mongoose.Document {
  firstName?: string,
  lastName?: string,
  bio?: string,
  position?: string,
  email?: string,
  avatar?: string,
  roles?: string[],
  /* Provider */
  provider?: string,
  providerData: {},
  additionalProvidersData: {},
  /* Password */
  password: string,
  resetPasswordToken: string,
  resetPasswordExpires: number,
  // startup requirement
  terms: Date,
  // other
  complementary: {}, // put your specific project private data here
}
/**
 * User Schema
 */
const UserMongoose = new mongoose.Schema({
  firstName: String,
  lastName: String,
  bio: String,
  position: String,
  email: {
    type: String,
    unique: 'Email already exists',
  },
  avatar: String,
  roles: [String],
  /* Provider */
  provider: String,
  providerData: {},
  additionalProvidersData: {},
  /* Password */
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // startup requirement
  terms: Date,
  // other
  complementary: {}, // put your specific project private data here
}, {
  timestamps: true,
});

function addID(this: any) {
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

export default mongoose.model<IUser>('User', UserMongoose);
