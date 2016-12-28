# Riess.js

Riess is a full stack JavaScript application framework.

It's backend origins are from the [meanjs](https://github.com/meanjs/mean) JavaScript project team, and thus Riess serves as the next evolutionary phase of the MEAN.JS framework.

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
