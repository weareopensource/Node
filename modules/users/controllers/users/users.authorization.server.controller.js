

/**
 * Module dependencies
 */
const mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid',
    });
  }

  User.findOne({
    _id: id,
  }).exec((err, user) => {
    if (err) {
      return next(err);
    } if (!user) {
      return next(new Error(`Failed to load User ${id}`));
    }

    req.profile = user;
    next();
  });
};
