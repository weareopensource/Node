/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * @desc Function to get all user in db
 * @return {Array} All users
 */
exports.team = () => User.find({ roles: 'admin' }, '-password -providerData -complementary').sort('-createdAt').exec();
