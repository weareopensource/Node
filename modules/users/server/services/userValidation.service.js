'use strict'

const path = require('path')
const config = require(path.resolve('./lib/config'))

const validator = require('validator')
const owasp = require('owasp-password-strength-test')

class UserValidationService {
  /**
   * A Validation function for username
   * - at least 3 characters
   * - only a-z0-9_-.
   * - contain at least one alphanumeric character
   * - not in list of illegal usernames
   * - no consecutive dots: "." ok, ".." nope
   * - not begin or end with "."
   */
  static validateUsername (user) {
    const username = user.username
    const usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/
    return (
      username.provider !== 'local' ||
      (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)
    )
  }

  /**
   * A Validation function for local strategy properties
   */
  static validateLocalStrategyProperty (user) {
    return (user && user.provider && user.provider !== 'local')
  }

  static validateFirstName (user) {
    // @TODO fix validation to convert to string and check expected validity
    return (this.validateLocalStrategyProperty(user) || user.firstName)
  }

  static validateLastName (user) {
    // @TODO fix validation to convert to string and check expected validity
    return (this.validateLocalStrategyProperty(user) || user.lastName)
  }

  static validatePassword (user) {
//    if (!this.validateLocalStrategyProperty(user)) {
//      return owasp.test(user.password)
//    }

    return true
  }

  /**
   * A Validation function for local strategy email
   */
  static validateEmail (user) {
    return (this.validateLocalStrategyProperty(user) || validator.isEmail(user.email, { require_tld: false }))
  }
}

module.exports = UserValidationService
