/**
 * Module dependencies
 */
import mongoose from 'mongoose';

const User = mongoose.model('User');

/**
 * @desc Function to get all user in db
 * @return {Array} All users
 */
export default function team() {
  return User.find({ roles: 'admin' }, '-password -providerData -complementary')
    .sort('-createdAt')
    .exec();
}
