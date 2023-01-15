## Require migration

- `const _ = require('lodash');` to `import _ from 'lodash';`
- `const errors = require(path.resolve('./lib/helpers/errors'));` to `import errors from '../../../lib/helpers/errors.js';`
- `const errors = require(path.resolve('./lib/helpers/errors'));` to `import errors from '../../../lib/helpers/errors.js';`

## Export migration

- Env Migration from `module.exports = _.merge(defaultConfig, {` to `export default _.merge(config.default, {`
- `*.routes.js` from `module.exports = (app) => {` to `export default (app) => {`
- `*.controlle.js` & `*.service.js from` & `*.repository.js` & `*.policy.js` & `*.schema.js` from

```
exports.list = async (req, res) => {
    ...
};
exports.create = async (req, res) => {
    ...
};
```

to

```
const list = async (req, res) => {
    ...
};
const create = async (req, res) => {
    ...
};
export default {
    list,
    create,
    ...
}
```

## Others

- `*.delete*` to `*.remove`except mongoose and express call
- `*.import*` to `*.push`
