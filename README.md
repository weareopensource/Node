[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/weareopensource?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Build Status](https://travis-ci.org/weareopensource/node.svg?branch=master)](https://travis-ci.org/weareopensource/node)
[![Dependencies Status](https://david-dm.org/weareopensource/node.svg)](https://david-dm.org/weareopensource/node)
[![Coverage Status](https://coveralls.io/repos/weareopensource/node/badge.svg?branch=master&service=github)](https://coveralls.io/github/weareopensource/node?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/weareopensource/node/badge.svg)](https://snyk.io/test/github/weareopensource/node)


# [WeAreOpenSource](https://weareopensource.me) Node

### Node / Express / Mongoose / Sequelize

## Presentation
This project a stack Node that can be ran as a standalone application. Or in a fullstack, like this example, [MEANie](https://github.com/weareopensource/MEANie). We are actually in Beta.

| Subject | Node
| ------- | --------
| **Node.js**  | v8
| **DB: SQL**  | Sequelize ORM
| **DB: Mongo**  | Mongoose
| **Deliver**  | Docker & Docker-compose
| **CI**  | Travis
| **Testing: Tools** | request, ava
| **Testing: Tests Automation** | separates tasks to unit tests, integration tests
| **Testing: ExpressJS** | gulp instantiates a real ExpressJS API service
| **Testing: Seed** | seed tasks resets the db/models to clear data and is separated to own gulp task
| **Developer: Community**  | uses `commitizen` to streamline commit guidelines
| **Developer: Debug**  | uses v8's builtin `debug` and `inspect` optionse

Planned:

| Subject  | Node
| -------  | --------
| **CI**  | Travis, Gitlab-ci
| **Config** | dotenv, convict
| **Documentation: API**  | Swagger
| **Documentation: Code**  | Docco
| **Developer: Lint** | Standard JS

## [Demo](http://meanie.weareopensource.me)  (This Node stack is used for this demonstration of MEANie fullstack)

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads)
* Node.js (7.x, 8.x) - [Download & Install Node.js](https://nodejs.org/en/download/)

## Installation
It's straightforward
```bash
$ git clone https://github.com/weareopensource/node.git && cd Node
$ npm i
```

## Running Your Application

### Development
* Run `npm start` for a dev server. Available at `http://localhost:3000/`.

### Production
* Run `npm run prod` to run on production mode. Available at `http://localhost:3000/`.

### Configuration
The running process takes into account all system environment variables defined under the form WAOS_BACK_<path_toVariable>. A pre-build npm script turns under the hood those system environment variables into an object, infering paths from the varialbles name, merged to the environment object defined on config/defaults/development.js, regardless of the production or developement mode.

All configuration avalable on config/defaults/development.js file are overidable. You can for instance define the API server coordonates by defining those system environment variables:

-  WAOS_BACK_host='my-server'
-  WAOS_BACK_port=4000

<!--
## Running unit tests
Run `gulp  test:server`
-->

## [Contribute](CONTRIBUTING.md)

## History

This work is based on [MEAN.js](http://meanjs.org) and more precisely on a fork of the developers named [Riess.js](https://github.com/lirantal/Riess.js). The work being stopped we wished to take it back, we want to create updated stack with same mindset "simple", "easy to use". The toolbox needed to start projects.

## [We Are Open Source, Who we are ?](https://weareopensource.me)
Today, we dreams to create Backs/Fronts, aligns on feats, in multiple languages, in order to allow anyone to compose fullstack on demand (React, Angular, VusJS, Node, Nest, Swift, Go).
Feel free to discuss, share other kind of bricks, and invite whoever you want with this mindset to come help us.

## License
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE.md)
