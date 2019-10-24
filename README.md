[![Build Status](https://badges.weareopensource.me/travis/weareopensource/Node.svg?style=flat-square)](https://travis-ci.org/weareopensource/Node) [![Coveralls Status](https://badges.weareopensource.me/coveralls/github/weareopensource/Node.svg?style=flat-square)](https://coveralls.io/github/weareopensource/Node) [![Code Climate](https://badges.weareopensource.me/codeclimate/maintainability-percentage/weareopensource/Node.svg?style=flat-square)](https://codeclimate.com/github/weareopensource/Node/maintainability)
 [![Dependencies Status](https://david-dm.org/weareopensource/node.svg?style=flat-square)](https://david-dm.org/weareopensource/node) [![Dependabot badge](https://badges.weareopensource.me/badge/Dependabot-enabled-2768cf.svg?style=flat-square)](https://dependabot.com)
 [![Known Vulnerabilities](https://snyk.io/test/github/weareopensource/node/badge.svg?style=flat-square)](https://snyk.io/test/github/weareopensource/node)

# [WeAreOpenSource](https://weareopensource.me) Node

## Presentation

This project is a stack Node that can be ran as a standalone backend. Or in a fullstack with another of our repo of your choice (ex: [Vue](https://github.com/weareopensource/Vue), [Swift](https://github.com/weareopensource/Swift)). 

You can have more informations about us in our [global repo](https://github.com/weareopensource/weareopensource.github.io) and here : 

* our mindset and what we would like to create in our [introduction](https://weareopensource.me/introduction/) (in construction)
* how to create a fullstack from our repo in our [global wiki](https://github.com/weareopensource/weareopensource.github.io/wiki) (in construciton).
* our global roadmap and propose ideas about stacks in our [board](https://github.com/weareopensource/weareopensource.github.io/projects/1)
* how to contribute and help us [here](https://github.com/weareopensource/weareopensource.github.io/blob/master/CONTRIBUTE.md)

Our stack node is actually in Beta. 

# Node / Express / Mongoose - Sequelize Orm

* [**Wiki**](https://github.com/weareopensource/Node/blob/master/WIKI.md) - wip
* [**Knowledges JS**](https://github.com/weareopensource/weareopensource.github.io/wiki/Knowledges-JS)
* [**Demo**](https://node.weareopensource.me) (or working with [Vue](https://github.com/weareopensource/Vue) stack [here](https://vue.weareopensource.me), email: *test@waos.me*, password: *TestWaos@2019*)

## Technology Overview

| Subject | Informations
| ------- | --------
| **Available** | 
| Architecture | Layered Architecture : everything is separated in layers, and the upper layers are abstractions of the lower ones, that's why every layer should only reference the immediate lower layer (vertical modules architecture with Repository and Services Pattern)
| Server  | [Node v12.x LTS](https://nodejs.org/en/) <br> [Express](https://github.com/expressjs/express) - [body-parser](https://github.com/expressjs/body-parser) - [compression](https://github.com/expressjs/compression) - [CORS](https://github.com/expressjs/cors) - [method-override](https://github.com/expressjs/method-override) <br> [gulp 4](https://github.com/gulpjs/gulp) - [nodemon](https://github.com/remy/nodemon) - [pm2](https://github.com/Unitech/pm2)
| DataBase  | [Mongo 4.x LTS](https://www.mongodb.com/download-center/community) &  [mongoose](https://github.com/Automattic/mongoose) (user management & crud Task example) <br> [Sequelize](https://github.com/sequelize/sequelize) : PostgreSQL, MySQL, SQLit 4.x (option - crud Task example) <br> [JOI](https://github.com/hapijs/joi) Models & Repository for database code abstraction <br> seed functions
| Testing |  [Jest](https://github.com/facebook/jest) & [SuperTest](https://github.com/visionmedia/supertest) (Coverage & Watch) <br> *example of mocha with gulp available*
| Linter  | [ESLint](https://github.com/eslint/eslint) ecmaVersion 10 (2019)
| Security | JWT Stateless - [passport-jwt](https://github.com/themikenicholson/passport-jwt) <br> Passwords: [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) - [zxcvbn](https://github.com/dropbox/zxcvbn) <br> DataBases options available (auth, ssl ..) <br> [SSL](https://github.com/weareopensource/Node/blob/master/WIKI.md#SSL) Express / Reverse Proxy (must be activated, otherwise => plain text password)
| API | Default answer wrapper (helper) : [jsend](https://github.com/omniti-labs/jsend) like : status, message, data or error <br>  Default error handling (helper) : formatted by the controller, Custom ES6 errors for other layers
| Logs | [winston](https://github.com/winstonjs/winston) [morgan](https://github.com/expressjs/morgan) *custom example available*
| CI  | [Travis CI](https://travis-ci.org/weareopensource/Node) 
| Developer  | [Coveralls](https://coveralls.io/github/weareopensource/Node) - [Code Climate](https://codeclimate.com/github/weareopensource/Node) - [Dependency status](https://david-dm.org/weareopensource/node) - [Dependabot](https://dependabot.com/) - [Snyk](https://snyk.io/test/github/weareopensource/node) <br> [standard-version](https://github.com/conventional-changelog/standard-version) - [commitlint](https://github.com/conventional-changelog/commitlint) - [commitizen](https://github.com/commitizen/cz-cli) - [waos-conventional-changelog](https://github.com/WeAreOpenSourceProjects/waos-conventional-changelog)
| Dependencies  | [npm](https://www.npmjs.com)
| **Being released** | 
| Deliver | Docker & Docker-compose
| **In reflexion** | 
| Documentation  | Swagger <br> Docco 
| Developer  | uses v8's builtin `debug` and `inspect` optionse
| API | evolution & version guideline 

## Features Overview

#### Available

* **User** : classic register / auth or oAuth(microsoft, google) - profile management (update, avatar upload ...)
* **Admin** : list users - edit user - delete user
* **Tasks** : list tasks - add tasks - edit tasks - delete tasks

#### In reflexion

RGPD conpliance 

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads)
* Node.js (10.x) - [Download & Install Node.js](https://nodejs.org/en/download/)

## Installation
It's straightforward (you can use yarn if you want)
```bash
$ git clone https://github.com/weareopensource/node.git && cd Node
$ npm i 
```

## Running Your Application

### Development
* `npm start` or `npm run serve` to run a dev server. Available at `http://localhost:3000/`.

### Production
* `npm run prod` to run a prod server. Available at `http://localhost:3000/`

### others 

* debug : `npm run debug`
* test : `npm test`
* test Watch : `npm run test:watch `
* test Coverage : `npm run test:coverage `
* seed development= `npm run seed:dev`
* seed Production = `npm run seed:prod`
* generate SSL certs : `npm run generate:sslCerts`
* lint : `npm run lint`
* commit : `npm run commit`
* release : `npm run release`

### Configuration

The default configuration is : `config/defaults/development.js`
The other configurations : `config/defaults/*.js` overwrite the default configuration, you can create your own. 

We take into account all system environment variables defined under the form WAOS_VUE_<path_toVariable>. A script turns under the hood those system environment variables into an object, infering paths from the varialbles name, merged to the configuration defined on `config/defaults` to regenerate the config.

So configuration avalable on `config/defaults/development` file are overidable. You can for instance define the app name by defining those system environment variables :

```
WAOS_NODE_app_name='my app =)'
```

## [Contribute](https://github.com/weareopensource/weareopensource.github.io/blob/master/CONTRIBUTE.md)

## History

This work is based on [MEAN.js](http://meanjs.org) and more precisely on a fork of the developers named [Riess.js](https://github.com/lirantal/Riess.js). The work being stopped we wished to take it back, we want to create updated stack with same mindset "simple", "easy to use". The toolbox needed to start projects, but not only with Node and Angular ...

## [We Are Open Source, Who we are ?](https://weareopensource.me)
Today, we dreams to create Backs/Fronts, aligns on feats, in multiple languages, in order to allow anyone to compose fullstack on demand (React, Angular, VusJS, Node, Nest, Swift, Go).
Feel free to discuss, share other kind of bricks, and invite whoever you want with this mindset to come help us.

## Licence

[![Packagist](https://badges.weareopensource.me/packagist/l/doctrine/orm.svg?style=flat-square)](/LICENSE.md)

## Dev

Pierre 

[![Blog](https://badges.weareopensource.me/badge/Read-WAOS%20Blog-1abc9c.svg?style=flat-square)](https://weareopensource.me) [![Slack](https://badges.weareopensource.me/badge/Chat-WAOS%20Slack-d0355b.svg?style=flat-square)](mailto:weareopensource.me@gmail.com?subject=Join%20Slack&body=Hi,%20I%20found%20your%20community%20We%20Are%20Open%20Source.%20I%20would%20be%20interested%20to%20join%20the%20Slack%20to%20share%20and%20discuss,%20Thanks) [![Mail](https://badges.weareopensource.me/badge/Contact-me%20by%20mail-00a8ff.svg?style=flat-square)](mailto:weareopensource.me@gmail.com?subject=Contact) [![Twitter](https://badges.weareopensource.me/badge/Follow-me%20on%20Twitter-3498db.svg?style=flat-square)](https://twitter.com/pbrisorgueil?lang=fr)  [![Youtube](https://badges.weareopensource.me/badge/Watch-me%20on%20Youtube-e74c3c.svg?style=flat-square)](https://www.youtube.com/channel/UCIIjHtrZL5-rFFupn7c3OtA)

Feel free to help us ! :) 
