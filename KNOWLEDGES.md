# Node Knwoledges

## Introduction 

This includes links to knowledge and tools and explaining the reason for the operations and architecture of this repo.

## Informations 

* **Bold** : used
* _Italic_ : not used

## Menu 

#### Node Knowledges 

* [Links](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md#links-tada)
* [Dependencies](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md#dependencies-arrow_up)
* [Tests](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md#tests-rotating_light)
* [CI](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md#ci-construction_worker:)
* [Password](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md#password-lock)
* [Logs](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md#logs-memo)

#### Other informations

* [Node Wiki](https://github.com/weareopensource/Node/blob/master/WIKI.md)
* [Node Knowledges](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md)
* [Global Wiki](https://github.com/weareopensource/weareopensource.github.io/wiki)
* [Changelog](https://github.com/weareopensource/Node/blob/master/CHANGELOG.md)
* [Licence](https://github.com/weareopensource/Node/blob/master/LICENSE.md)
* [Contribute](https://github.com/weareopensource/weareopensource.github.io/wiki/Contribute)

#### WAOS

* [Our Mindset](https://weareopensource.me/introduction/)
* [Our Roadmap](https://github.com/weareopensource/weareopensource.github.io/projects)
* [Us](https://github.com/weareopensource/weareopensource.github.io/wiki/Us)
* [Help Us](https://github.com/weareopensource/weareopensource.github.io/wiki/HelpUs)

## Links :tada:

- [npm Trends](https://www.npmtrends.com)

## Dependencies :arrow_up:

#### Articles :
- WIP

#### Tools :
- **[NPM](https://www.npmjs.comya)**
- **[Yarn](https://yarnpkg.com/en/)**

#### Conclusion
Both :), package.json matter, do your own choice. 

## Tests :rotating_light:

#### Articles :
- [Comparing Jasmine, Mocha, AVA, Tape, and Jest](https://dzone.com/articles/comparing-jasmine-mocha-ava-tape-and-jest)
- [Jest vs. AVA](https://stackshare.io/stackups/ava-vs-jest)

#### Tools :
- _[ava](https://github.com/avajs/ava)_ - Testing can be a drag. AVA helps you get it done.
- _[jasmine](https://github.com/jasmine/jasmine-npm)_ - A jasmine runner for node projects.
- _[mocha](https://github.com/mochajs/mocha)_ - simple, flexible, fun javascript test framework for node.js & the browser
- **[jest](https://github.com/facebook/jest)** - Delightful JavaScript Testing
- **[supertest](https://github.com/visionmedia/supertest)** - Super-agent driven library for testing node.js HTTP servers using a fluent API.
- _[chai](https://github.com/chaijs/chai)_ - BDD / TDD assertion framework for node.js 
- _[should](https://github.com/shouldjs/should.js)_ - BDD style assertions for node.js -- test framework agnostic

#### Conclusion
Jest because of [trends](https://www.npmtrends.com/ava-vs-jasmine-vs-jest-vs-mocha-vs-qunit), with supertest for simplicity. With this config, chai or should was useless. 

## CI :construction_worker: 

#### Articles :
- [7 Convenient CI/CD Tools for Your Node.js Projects](https://nodesource.com/blog/seven-convenient-ci-cd-tools-for-your-node-js-projects/)
- [How to set up CI/CD Pipeline for a node.js app with Jenkin](https://medium.com/@mosheezderman/how-to-set-up-ci-cd-pipeline-for-a-node-js-app-with-jenkins-c51581cc783c)
- [circleci tuto](https://circleci.com/docs/2.0/language-javascript/)

#### Tools :
- **[Travis](https://travis-ci.org)** - way to test and deploy your projects
- _[Circle](https://circleci.com)_ - way to test and deploy your projects
- **[Coveralls](https://coveralls.io)** - See coverage trends emerge
- **[CodeClimate](https://codeclimate.com/dashboard)** - Get automated code coverage, complexity, duplication ..
- **[EsLint](https://eslint.org)** - A tool to enforce Node style and conventions
- **[Dependencies](https://david-dm.org/)** - dependencies check up
- **[GreenKeeper](https://greenkeeper.io)** - dependencies PR
- **[Snyk.io](https://snyk.io)** - Vulnerabilities check up

#### Conclusion
Travis, Codeclimate, Coveralls (more details than codeclimate), EsLint, Dependencies + GreenKeeper, Snyk.io

## Password :lock: 

#### Articles :
- [hashing in action understanding bcrypt](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)
- [nodejs bcrypt vs native crypto](https://stackoverflow.com/questions/6951867/nodejs-bcrypt-vs-native-crypto)

#### Tools :
- **[bcrypt](hhttps://www.npmjs.com/package/bcrypt)** - way to test and deploy your projects
- [crypto-js](https://github.com/brix/crypto-js) - JavaScript library of crypto standards.

## Logs :memo: 

#### Articles :
- [how to use winston to log node js applications](https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications)

#### Tools :
- **[winston](https://github.com/winstonjs/winston)** - A logger for just about everything.
- **[morgan](https://github.com/expressjs/morgan)** - HTTP request logger middleware for node.js.


#### Conclusion
winston for everything, morgan for http ([trends](https://www.npmtrends.com/morgan-vs-winston)).