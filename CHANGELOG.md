# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

#  (2019-03-05)


### Bug Fixes

* **debug:** fixing gulp node debug task ([#1689](https://github.com/weareopensource/Node/issues/1689)) ([531e3a1](https://github.com/weareopensource/Node/commit/531e3a1))
* **environment:** setting `test.js` environment for the sequlize orm to be `meantest` instead of `me ([bf3361e](https://github.com/weareopensource/Node/commit/bf3361e))
* **gulp:** fixing gulp-ava task usage which didnt return the stream which is why it didnt emit the ' ([3a36de1](https://github.com/weareopensource/Node/commit/3a36de1))
* **jwt:** env variable name change for jwt secret ([ad651b9](https://github.com/weareopensource/Node/commit/ad651b9))
* **logger:** fix re-instantiation of winston loggers on method calls ([b6056fb](https://github.com/weareopensource/Node/commit/b6056fb))
* **mongoose:** fixing mongoose deprecation notice for promises library integration ([#1690](https://github.com/weareopensource/Node/issues/1690)) ([008ec75](https://github.com/weareopensource/Node/commit/008ec75))
* **package:** update mock-fs to version 4.8.0 ([ed1c772](https://github.com/weareopensource/Node/commit/ed1c772))
* .snyk to reduce vulnerabilities ([2ffe38a](https://github.com/weareopensource/Node/commit/2ffe38a))
* configure Snyk protect to enable patches ([9ca9600](https://github.com/weareopensource/Node/commit/9ca9600))
* **seed:** gulp task `test:seed` would hang on the gulp node process and not exit ([075e66c](https://github.com/weareopensource/Node/commit/075e66c))
* **sequelize:** fixing error handling in in sequelize lib instantiation ([02608a2](https://github.com/weareopensource/Node/commit/02608a2))
* **server:** fixing un-handled promise rejections when initaitlizing the app ([f73ec2b](https://github.com/weareopensource/Node/commit/f73ec2b))
* **tasks:** fixing tasks controller to use `req.user` as the storage of logged-in user details ([7430140](https://github.com/weareopensource/Node/commit/7430140))
* **tests:** refactoring tests to dismiss the supertest wrapper ([dc17715](https://github.com/weareopensource/Node/commit/dc17715))


### Features

* **auth:** refactoring local user authentication strategy ([0689d0c](https://github.com/weareopensource/Node/commit/0689d0c))
* **ava:** initial project setup for ava test runner ([0f4da27](https://github.com/weareopensource/Node/commit/0f4da27))
* **commitizen): feat(commitizen:** introducing project support for commitizen ([f7acd13](https://github.com/weareopensource/Node/commit/f7acd13))
* **error:** generic error handler for API requests ([f8274cb](https://github.com/weareopensource/Node/commit/f8274cb)), closes [#11](https://github.com/weareopensource/Node/issues/11)
* **error:** generic error handler for API requests ([cd56b58](https://github.com/weareopensource/Node/commit/cd56b58))
* **jwt:** adding initial support for jwt authentication ([7b63c78](https://github.com/weareopensource/Node/commit/7b63c78))
* **jwt:** tidying up strategy definition ([3e2644f](https://github.com/weareopensource/Node/commit/3e2644f))
* **pacakge.json:** update engines and npm run scripts ([e7a8b9e](https://github.com/weareopensource/Node/commit/e7a8b9e))
* **seed:** adding seed support for sequelize and compiled both into a gulp task, also took out the ([ae3eaf3](https://github.com/weareopensource/Node/commit/ae3eaf3))
* **seed:** refactoring seeding functionality to be exported by the mongoose helper library and used as a gulp task, rather than the server bootstrap method ([27b4941](https://github.com/weareopensource/Node/commit/27b4941))
* **tasks:** new tasks module to use sequelizejs ([#1693](https://github.com/weareopensource/Node/issues/1693)) ([3f9a872](https://github.com/weareopensource/Node/commit/3f9a872))



#  (2019-03-05)


### Bug Fixes

* **debug:** fixing gulp node debug task ([#1689](https://github.com/weareopensource/Node/issues/1689)) ([531e3a1](https://github.com/weareopensource/Node/commit/531e3a1))
* **environment:** setting `test.js` environment for the sequlize orm to be `meantest` instead of `me ([bf3361e](https://github.com/weareopensource/Node/commit/bf3361e))
* **gulp:** fixing gulp-ava task usage which didnt return the stream which is why it didnt emit the ' ([3a36de1](https://github.com/weareopensource/Node/commit/3a36de1))
* **jwt:** env variable name change for jwt secret ([ad651b9](https://github.com/weareopensource/Node/commit/ad651b9))
* **logger:** fix re-instantiation of winston loggers on method calls ([b6056fb](https://github.com/weareopensource/Node/commit/b6056fb))
* **mongoose:** fixing mongoose deprecation notice for promises library integration ([#1690](https://github.com/weareopensource/Node/issues/1690)) ([008ec75](https://github.com/weareopensource/Node/commit/008ec75))
* **package:** update mock-fs to version 4.8.0 ([ed1c772](https://github.com/weareopensource/Node/commit/ed1c772))
* .snyk to reduce vulnerabilities ([2ffe38a](https://github.com/weareopensource/Node/commit/2ffe38a))
* configure Snyk protect to enable patches ([9ca9600](https://github.com/weareopensource/Node/commit/9ca9600))
* **seed:** gulp task `test:seed` would hang on the gulp node process and not exit ([075e66c](https://github.com/weareopensource/Node/commit/075e66c))
* **sequelize:** fixing error handling in in sequelize lib instantiation ([02608a2](https://github.com/weareopensource/Node/commit/02608a2))
* **server:** fixing un-handled promise rejections when initaitlizing the app ([f73ec2b](https://github.com/weareopensource/Node/commit/f73ec2b))
* **tasks:** fixing tasks controller to use `req.user` as the storage of logged-in user details ([7430140](https://github.com/weareopensource/Node/commit/7430140))
* **tests:** refactoring tests to dismiss the supertest wrapper ([dc17715](https://github.com/weareopensource/Node/commit/dc17715))


### Features

* **auth:** refactoring local user authentication strategy ([0689d0c](https://github.com/weareopensource/Node/commit/0689d0c))
* **ava:** initial project setup for ava test runner ([0f4da27](https://github.com/weareopensource/Node/commit/0f4da27))
* **commitizen): feat(commitizen:** introducing project support for commitizen ([f7acd13](https://github.com/weareopensource/Node/commit/f7acd13))
* **error:** generic error handler for API requests ([cd56b58](https://github.com/weareopensource/Node/commit/cd56b58))
* **jwt:** adding initial support for jwt authentication ([7b63c78](https://github.com/weareopensource/Node/commit/7b63c78))
* **jwt:** tidying up strategy definition ([3e2644f](https://github.com/weareopensource/Node/commit/3e2644f))
* **pacakge.json:** update engines and npm run scripts ([e7a8b9e](https://github.com/weareopensource/Node/commit/e7a8b9e))
* **seed:** adding seed support for sequelize and compiled both into a gulp task, also took out the ([ae3eaf3](https://github.com/weareopensource/Node/commit/ae3eaf3))
* **seed:** refactoring seeding functionality to be exported by the mongoose helper library and used as a gulp task, rather than the server bootstrap method ([27b4941](https://github.com/weareopensource/Node/commit/27b4941))
* **tasks:** new tasks module to use sequelizejs ([#1693](https://github.com/weareopensource/Node/issues/1693)) ([3f9a872](https://github.com/weareopensource/Node/commit/3f9a872))
