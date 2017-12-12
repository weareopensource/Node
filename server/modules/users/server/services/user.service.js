'use strict'

const path = require('path')
const config = require(path.resolve('./lib/config'))
const bcrypt = require('bcrypt')
const generatePassword = require('generate-password')
const owasp = require('owasp-password-strength-test')
const passport = require('passport')

const UserRepository = require('../repositories/user.repository')
const UserValidationService = require('./userValidation.service')

owasp.config(config.shared.owasp)
const SALT_ROUNDS = 10

class UserService {
  static deserialize (user) {
    if (!user || typeof user !== 'object') {
      return null
    }

    return {
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      provider: user.provider,
      created: user.created,
    }
  }

  static async getUserDeserializedById(id) {
    const user = await UserRepository.getById(id)
    return this.deserialize(user)
  }

  static async authenticate (email, password) {
    const user = await UserRepository.getByEmail(email)

    if (!user) {
      throw new Error('invalid user or password')
    }

    if (await this.comparePassword(password, user.password)) {
      return this.deserialize(user)
    } else {
      throw new Error('invalid user or password')
    }
  }

  static async signUp (userObj) {

    // Set provider to local
    userObj.provider = 'local'

    // For security measurement we remove the roles from the req.body object
    delete userObj.roles
    if (!UserValidationService.validateUsername(userObj)) {
      return Promise.resolve(false)
    }

    if (!UserValidationService.validateFirstName(userObj)) {
      // return Promise.resolve('Please fill in your first name')
      throw new Error('Please fill in your first name')
    }

    if (!UserValidationService.validateLastName(userObj)) {
      throw new Error('Please fill in your last name')
    }

    if (!UserValidationService.validateEmail(userObj)) {
      throw new Error('Please fill a valid email address')
    }

    // When password is provided we need to make sure that it is
    // confirming to secure password policies
    const validPassword = UserValidationService.validatePassword(userObj)
    if (validPassword !== true && validPassword.errors && validPassword.errors.length) {
      const errors = validPassword.errors.join(' ')
      throw new Error(errors)
    }

    // When password is provided we need to make sure we are hashing it
    if (userObj.password) {
      userObj.password = await this.hashPassword(userObj.password)
    }

    const user = await UserRepository.create(userObj)

    // Remove sensitive data before login
    // @TODO instead of blacklisting unwanted properties we should
    // instead only return a newly composed object of expected properties
    // otherwise we return fields from the repository like mongo's __v field
    user.password = undefined;
    user.salt = undefined;

    return Promise.resolve(user)
  }

  static async comparePassword (userPassword, storedPassword) {
    return bcrypt.compare(String(userPassword), String(storedPassword))
  }

  static async hashPassword (password) {
    return bcrypt.hash(String(password), SALT_ROUNDS)
  }

  /**
   * Generates a random passphrase that passes the owasp test
   * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
   * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
   */
  static generateRandomPassphrase () {
    return new Promise((resolve, reject) => {
      var password = ''
      var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g')

      // iterate until the we have a valid passphrase
      // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
      while (password.length < 20 || repeatingCharacters.test(password)) {
        // build the random password
        password = generatePassword.generate({
          length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
          numbers: true,
          symbols: false,
          uppercase: true,
          excludeSimilarCharacters: true
        })

        // check if we need to remove any repeating characters
        password = password.replace(repeatingCharacters, '')
      }

      // Send the rejection back if the passphrase fails to pass the strength test
      if (owasp.test(password).errors.length) {
        reject(new Error('An unexpected problem occured while generating the random passphrase'))
      } else {
        // resolve with the validated passphrase
        resolve(password)
      }
    })
  }
}

module.exports = UserService
