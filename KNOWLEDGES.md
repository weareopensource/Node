This includes links to knowledge and tools and explaining the reason for the operations and architecture of this repo.

* **Bold** : used
* _Italic_ : not used

### Node Links :tada:

- [npm Trends](https://www.npmtrends.com)

### Dependencies :arrow_up:

#### Articles :
- WIP

#### Tools :
- **[NPM](https://www.npmjs.comya)**
- **[Yarn](https://yarnpkg.com/en/)**

#### Conclusion
Both :), package.json matter, do your own choice. 

### Tests :rotating_light:

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
Jest because of trends : https://www.npmtrends.com/ava-vs-jasmine-vs-jest-vs-mocha-vs-qunit, with supertest for simplicity. With this config, chai or should was useless. 

### CI & .. :construction_worker: 

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
