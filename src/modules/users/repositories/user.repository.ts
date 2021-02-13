/**
 * Module dependencies
 */
import mongoose from 'mongoose';
import User from '../models/user.model.mongoose';
/**
 * @desc Function to get all user in db
 */
export async function list(searchFilter: RegExp, page, perPage) {
  const filter = searchFilter ? {
    $or: [
      { firstName: { $regex: `${searchFilter}`, $options: 'i' } },
      { lastName: { $regex: `${searchFilter}`, $options: 'i' } },
      { email: { $regex: `${searchFilter}`, $options: 'i' } },
    ],
  } : {};
  return User.find(filter).limit(perPage)
    .skip(perPage * page)
    .select('-password -providerData')
    .sort('-createdAt')
    .exec();
}

/**
 * @desc Function to create a user in db
 * @param {Object} user
 * @return {Object} user
 */
export async function create(user) {
  return new User(user).save();
}

/**
 * @desc Function to get a user from db by id or email
 * @param {Object} user
 * @return {Object} user
 */
export async function get(user) {
  if (user.id && mongoose.Types.ObjectId.isValid(user.id)) return User.findOne({ _id: user.id }).exec();
  if (user.email) return User.findOne({ email: user.email }).exec();
  if (user.resetPasswordToken) {
    return User.findOne({
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    }).exec();
  }
}

/**
 * @desc Function to get a search in db request
 * @param {Object} mongoose input request
 * @return {Array} users
 */
export async function search(input) {
  return User.find(input)
    .exec();
}

/**
 * @desc Function to update a user in db
 * @param {Object} user
 * @return {Object} user
 */
export async function update(user) {
  return new User(user).save();
}

/**
 * @desc Function to delete a user from db by id or email
 * @param {Object} user
 * @return {Object} confirmation of delete
 */
export async function deleteUser(user) {
  if (user.id && mongoose.Types.ObjectId.isValid(user.id)) return User.deleteOne({ _id: user.id }).exec();
  if (user.email) return User.deleteOne({ email: user.email }).exec();
}

/**
 * @desc Function to get collection stats
 * @return {Object} scrap
 */
export async function stats() {
  return User.countDocuments();
}

/**
 * @desc Function to import list of users in db
 * @param {[Object]} users
 * @param {[String]} filters
 * @return {Object} locations
 */
export async function importUser(users, filters) {
  return User.bulkWrite(users.map((user) => {
    const filter = {};
    filters.forEach((value) => {
      filter[value] = user[value];
    });
    return {
      updateOne: {
        filter,
        update: user,
        upsert: true,
      },
    };
  }));
}
