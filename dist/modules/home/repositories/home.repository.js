"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const User = mongoose_1.default.model('User');
/**
 * @desc Function to get all user in db
 * @return {Array} All users
 */
function team() {
    return User.find({ roles: 'admin' }, '-password -providerData -complementary')
        .sort('-createdAt')
        .exec();
}
exports.default = team;
//# sourceMappingURL=home.repository.js.map