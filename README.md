[![Build Status](https://badges.weareopensource.me/travis/weareopensource/Node.svg?style=flat-square)](https://travis-ci.org/weareopensource/Node) [![Drone](https://badges.weareopensource.me/drone/build/weareopensource/Node?style=flat-square)](https://cloud.drone.io/weareopensource/Node) [![Coveralls Status](https://badges.weareopensource.me/coveralls/github/weareopensource/Node.svg?style=flat-square)](https://coveralls.io/github/weareopensource/Node) [![Code Climate](https://badges.weareopensource.me/codeclimate/maintainability-percentage/weareopensource/Node.svg?style=flat-square)](https://codeclimate.com/github/weareopensource/Node/maintainability)
 [![Dependabot badge](https://badges.weareopensource.me/badge/Dependabot-enabled-2768cf.svg?style=flat-square)](https://dependabot.com)
 [![Known Vulnerabilities](https://snyk.io/test/github/weareopensource/node/badge.svg?style=flat-square)](https://snyk.io/test/github/weareopensource/node) [![Docker Pulls](https://badges.weareopensource.me/docker/pulls/weareopensource/node?style=flat-square)](https://hub.docker.com/repository/docker/weareopensource/node)

# :globe_with_meridians: [WeAreOpenSource](https://weareopensource.me) Node - Beta

## :book: Presentation

This project is a Node stack that can be ran as a standalone BackEnd. Or in a fullstack with another repo of your choice (ex: [Vue](https://github.com/weareopensource/Vue), [Swift](https://github.com/weareopensource/Swift)).

Quick links :

* [Mindset and what we would like to create](https://weareopensource.me/)
* [How to start a project and maintain updates from stacks](https://blog.weareopensource.me/start-a-project-and-maintain-updates/)
* [Global roadmap and  ideas about stacks](https://github.com/orgs/weareopensource/projects/3)
* [How to contribute and help us](https://blog.weareopensource.me/how-to-contribute/)
Our stack node is actually in Beta.

# :computer: Node / Express / Mongoose - Sequelize Orm

* [**Knowledges JS**](https://blog.weareopensource.me/js-knwoledges/)
* [**Demo**](https://node.weareopensource.me) (or working with [Vue](https://github.com/weareopensource/Vue) stack [here](https://vue.weareopensource.me), email: *test@waos.me*, password: *TestWaos@2019*)

## :package: Technology Overview

| Subject | Informations
| ------- | --------
| **Available** |
| Architecture | Layered Architecture : everything is separated in layers, and the upper layers are abstractions of the lower ones, that's why every layer should only reference the immediate lower layer (vertical modules architecture with Repository and Services Pattern)
| Server  | [Node >= v14 LTS](https://nodejs.org/en/) <br> [Express](https://github.com/expressjs/express) - [body-parser](https://github.com/expressjs/body-parser) - [compression](https://github.com/expressjs/compression) - [CORS](https://github.com/expressjs/cors) - [method-override](https://github.com/expressjs/method-override) <br> [gulp 4](https://github.com/gulpjs/gulp) - [nodemon](https://github.com/remy/nodemon)
| DataBase  | [Mongo 4.x LTS](https://www.mongodb.com/download-center/community) - [mongoose](https://github.com/Automattic/mongoose) - *User, Crud, Seed, Gridf upload, Options (auth, ssl ..)* <br> [Sequelize](https://github.com/sequelize/sequelize) - *PostgreSQL, MySQL, SQLit 4.x (option - crud Task example)* <br> [JOI](https://github.com/hapijs/joi) - *Models & Repository for database code abstraction*
| Testing |  [Jest](https://github.com/facebook/jest) - [SuperTest](https://github.com/visionmedia/supertest) - *Coverage & Watch* <br> *example of mocha with gulp available*
| Security | [passport-jwt](https://github.com/themikenicholson/passport-jwt) - *JWT Stateless* <br> [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) - [zxcvbn](https://github.com/dropbox/zxcvbn) - *Passwords*  <br> [SSL](https://github.com/weareopensource/Node/blob/master/WIKI.md#SSL) - *Express / Reverse Proxy (must be activated, otherwise => plain text password)*
| API | [jsend](https://github.com/omniti-labs/jsend) - *Default answer wrapper (helper) : status, message, data or error* <br>  *Helper: default errors handling : formatted by the controller, Custom ES6 errors for other layers*
| Upload | [Mongo gridfs](https://docs.mongodb.com/manual/core/gridfs/) - [mongoose-gridfs](https://github.com/lykmapipo/mongoose-gridfs) - [Multer](https://github.com/expressjs/multer) - [Sharp](https://github.com/lovell/sharp) - *Image stream example, all contentType, image video ..*
| Logs | [winston](https://github.com/winstonjs/winston) - [morgan](https://github.com/expressjs/morgan) *custom example available*
| CI  | [Travis CI](https://travis-ci.org/weareopensource/Node) - [Drone.io](https://cloud.drone.io/weareopensource/Node)
| Linter  | [ESLint](https://github.com/eslint/eslint) - *ecmaVersion 10 (2019)*
| Developer  | [Coveralls](https://coveralls.io/github/weareopensource/Node) - [Code Climate](https://codeclimate.com/github/weareopensource/Node) - [Dependency status](https://david-dm.org/weareopensource/node) - [Dependabot](https://dependabot.com/) - [Snyk](https://snyk.io/test/github/weareopensource/node) <br> [standard-version](https://github.com/conventional-changelog/standard-version) / [semantic-release](https://github.com/semantic-release/semantic-release) - [commitlint](https://github.com/conventional-changelog/commitlint) - [commitizen](https://github.com/commitizen/cz-cli) - [@weareopensource/conventional-changelog](https://github.com/weareopensource/conventional-changelog)
| Dependencies  | [npm](https://www.npmjs.com)
| Deliver | Docker & Docker-compose
| **In reflexion** |
| Documentation  | Swagger <br> Docco
| Developer  | uses v8's builtin `debug` and `inspect` options
| API | evolution & version guideline

## :tada: Features Overview

### Core

* **User** : classic register / auth or oAuth(microsoft, google) - profile management (update, avatar upload ...)
* **User data privacy** : delete all - get all - send all by mail
* **Admin** : list users - get user - edit user - delete user

### Examples

* **Tasks** : list - get - add - edit - delete
* **Files Uploads** : get stream - add - delete  - get image stream & sharp operations

## :pushpin: Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

* Git - [Download & Install Git](https://git-scm.com/downloads)
* Node.js (10.x) - [Download & Install Node.js](https://nodejs.org/en/download/)

## :boom: Installation

It's straightforward (you can use yarn if you want)

```bash
git clone https://github.com/weareopensource/node.git && cd Node
npm i
```

## :runner: Running Your Application

### Development

* `npm start` or `npm run serve` to run a dev server. Available at `http://localhost:3000/`.

### Production

* `npm run prod` to run a prod server. Available at `http://localhost:3000/`

### others

* debug : `npm run debug`
* test : `npm test`
* test Watch : `npm run test:watch`
* test Coverage : `npm run test:coverage`
* seed development= `npm run seed:dev`
* seed Production = `npm run seed:prod`
* seed Dump Mongo (Dev Team sample) = `npm run seed:mongodump` **be careful to not upload sample in public repo**
* seed Restore Mongo (Dev Team sample) = `npm run seed:mongorestore` **create or update data based on _id, no purge**
* seed Drop Mongo = `npm run seed:mongodrop`
* generate SSL certs : `npm run generate:sslCerts`
* lint : `npm run lint`
* commit : `npm run commit`
* release : `npm run release -- --first-release` **standard version, changelog, tag & choose version number : -- --release-as 1.1.1**
* release:auto : `GITHUB_TOKEN=XXXXX npm run release:auto` **semantic release, changelog, tag, release** *require repositoryUrl conf in package.json*

## :whale: Docker Way

### docker

* `docker run --env WAOS_NODE_db_uri=mongodb://host.docker.internal/WaosNodeDev --env WAOS_NODE_host=0.0.0.0 --rm -p 3000:3000 weareopensource/node`

if you want to build yourself : `docker build -t weareopensource/node .`

### docker-compose

* `docker-compose up`

### Configuration

The default configuration is : `config/defaults/development.js`
The other configurations : `config/defaults/*.js` overwrite the default configuration, you can create your own.

We take into account all system environment variables defined under the form WAOS_VUE_<path_toVariable>. A script turns under the hood those system environment variables into an object, infering paths from the varialbles name, merged to the configuration defined on `config/defaults` to regenerate the config.

So configuration avalable on `config/defaults/development` file are overidable. You can for instance define the app name by defining those system environment variables :

```
WAOS_NODE_app_title='my app =)'
```

## :pencil2: [Contribute](https://blog.weareopensource.me/how-to-contribute/)

## :scroll: History

This work is based on [MEAN.js](http://meanjs.org) and more precisely on a fork of the developers named [Riess.js](https://github.com/lirantal/Riess.js). The work being stopped we wished to take it back, we want to create updated stack with same mindset "simple", "easy to use". The toolbox needed to start projects, but not only with Node and Angular ...

## :globe_with_meridians: [We Are Open Source, Who we are ?](https://weareopensource.me)

Today, we dreams to create Backs/Fronts, aligns on feats, in multiple languages, in order to allow anyone to compose fullstack on demand (React, Angular, VusJS, Node, Nest, Swift, Go).
Feel free to discuss, share other kind of bricks, and invite whoever you want with this mindset to come help us.

## :clipboard: Licence

[![Packagist](https://badges.weareopensource.me/packagist/l/doctrine/orm.svg?style=flat-square)](/LICENSE.md)

## :family: Main Team

* Pierre Brisorgueil

[![Github](https://badges.weareopensource.me/badge/Follow-me%20on%20Github-282828.svg?style=flat-square)](https://github.com/PierreBrisorgueil) [![Twitter](https://badges.weareopensource.me/badge/Follow-me%20on%20Twitter-3498db.svg?style=flat-square)](https://twitter.com/pbrisorgueil?lang=fr) [![Youtube](https://badges.weareopensource.me/badge/Watch-me%20on%20Youtube-e74c3c.svg?style=flat-square)](https://www.youtube.com/channel/UCIIjHtrZL5-rFFupn7c3OtA) [![Instagram](https://badges.weareopensource.me/badge/Follow-me%20on%20Instagram-f27231.svg?style=flat-square)](https://www.instagram.com/pierre_brsrgl/) [![Linkedin](https://badges.weareopensource.me/badge/Add-me%20on%20linkedin-006DA9.svg?style=flat-square)](https://www.linkedin.com/in/pierre-brisorgueil/)

Feel free to help us ! :)

## :link: Links

[![Blog](https://badges.weareopensource.me/badge/Read-our%20Blog-1abc9c.svg?style=flat-square)](https://blog.weareopensource.me) [![Slack](https://badges.weareopensource.me/badge/Chat-on%20our%20Slack-d0355b.svg?style=flat-square)](https://join.slack.com/t/weareopensource/shared_invite/zt-62p1qxna-PEQn289qx6mmHobzKW8QFw) [![Discord](https://badges.weareopensource.me/badge/Chat-on%20our%20Discord-516DB9.svg?style=flat-square)](https://discord.gg/U2a2vVm)  [![Mail](https://badges.weareopensource.me/badge/Contact-us%20by%20mail-00a8ff.svg?style=flat-square)](mailto:weareopensource.me@gmail.com?subject=Contact)
