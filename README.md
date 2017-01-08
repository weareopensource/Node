# Riess.js

Riess is a full stack JavaScript application framework.

It's backend origins are from the [meanjs](https://github.com/meanjs/mean) JavaScript project team, and thus Riess serves as the next evolutionary phase of the MEAN.JS framework.

# Status Notice

This repository and project status is very raw.

Work on repository is fairly new and started only in December 2016 so many of the pushed functionality in the project could be half-baked, hanging for more commits to "finish" or better approach the code (expect many re-factoring).

On the plus side, it means there's a room for contribution and ideas to be implemented.

# MEAN.JS 1 to Riess.js

The following table summarizes enhancements and changes made in Riess.js to update the original MEAN.JS project with current Node.js and JavaScript technology tools.

Already implemented:

| Subject | MEAN.JS 1 | Riess.js
| ------- | --------- | --------
| **Testing:Tools** | supertest, mocha, should.js | request, ava 
| **Testing:Tests Automation** | All tests run as one task | separates tasks to unit tests, integration tests
| **Testing:ExpressJS** | supertest wraps expressjs `app` | gulp instantiates a real ExpressJS API service
| **Testing:Seed** | seeds based on global seed.js file, only user and pass | seed tasks resets the db/models to clear data and is separated to own gulp task
| **Developer:Community** | commit guidelines advised in PR | uses `commitizen` to streamline commit guidelines
| **Developer:Debug** | node-inspector (missing v7 support) | uses v7's builtin `debug` and `inspect` options
| **Node.js** | v4 | v7 with --harmony
| **Async Functionality** | Callbacks | Async/Await and native Node.js Promise
| **SQL** | N/A | Sequelize ORM

Planned:

| Subject | MEAN.JS 1 | Riess.js
| ------- | --------- | --------
| **Documentation:API** | N/A | Swagger
| **Documentation:Code** | N/A | Docco
| **Developer:Lint** | MEAN.JS specific eslint rules | Standard JS

Ideas:

* RethinkDB or alternative?
* Redis
* JWT 
* Replace existing implementation of social logins with Passport or consider integration with Auth0


# Architecture

## Directory Structure

To keep a technology agnostic and developer-freedom approach, Riess implements the following directory structure which de-couples the frontend project and the backend project completely. As such, they are developed in completely separated directories, each with it's own node modules, task runner, module builder, and so on.

It is depicted as follows:

```
server/
client/
```

This approach provides the following benefits:
* The `server` is completely de-coupled from the frontend, so anyone can take the server directory and use it for a pure API backend server that is suitable for microservices architecture, or just plug it in to another frontend project.
* The `client` providing the frontend project is not dependent on the server, and therefore a developer is free to implement their own client frontend code using `create-react-app`, `angular-cli`, or `vue.js`. The choice is yours.


# About the name

Riess is named after [Adam Riess](https://en.wikipedia.org/wiki/Adam_Riess), an astrophysicist who won the Nobel prize for providing evidence that our universe is in a state of accelerated expansion.

Greatly inspired, Riess.js seeks to provide a solid structure and flexible framework for improved developer experience and increased productivity, while staying in par with the accelerated pace of the JavaScript ecosystem.
