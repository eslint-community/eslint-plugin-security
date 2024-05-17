# eslint-plugin-security

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-security.svg?style=flat)](https://npmjs.org/package/eslint-plugin-security)

ESLint rules for Node Security

This project will help identify potential security hotspots, but finds a lot of false positives which need triage by a human.

## Installation

```sh
npm install --save-dev eslint-plugin-security
```

or

```sh
yarn add --dev eslint-plugin-security
```

## Usage

### Flat config (requires eslint >= v8.23.0)

Add the following to your `eslint.config.js` file:

```js
const pluginSecurity = require('eslint-plugin-security');

module.exports = [pluginSecurity.configs.recommended];
```

### eslintrc config (deprecated)

Add the following to your `.eslintrc` file:

```js
module.exports = {
  extends: ['plugin:security/recommended-legacy'],
};
```

## Developer guide

- Use [GitHub pull requests](https://help.github.com/articles/using-pull-requests).
- Conventions:
- We use our [custom ESLint setup](https://github.com/nodesecurity/eslint-config-nodesecurity).
- Please implement a test for each new rule and use this command to be sure the new code respects the style guide and the tests keep passing:

```sh
npm run-script cont-int
```

## Tests

```sh
npm test
```

## Rules

<!-- begin auto-generated rules list -->

⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.

| Name                                                                                         | Description                                                                                                                   | ⚠️  |
| :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :-- |
| [detect-bidi-characters](docs/rules/detect-bidi-characters.md)                               | Detects trojan source attacks that employ unicode bidi attacks to inject malicious code.                                      | ✅  |
| [detect-buffer-noassert](docs/rules/detect-buffer-noassert.md)                               | Detects calls to "buffer" with "noAssert" flag set.                                                                           | ✅  |
| [detect-child-process](docs/rules/detect-child-process.md)                                   | Detects instances of "child_process" & non-literal "exec()" calls.                                                            | ✅  |
| [detect-disable-mustache-escape](docs/rules/detect-disable-mustache-escape.md)               | Detects "object.escapeMarkup = false", which can be used with some template engines to disable escaping of HTML entities.     | ✅  |
| [detect-eval-with-expression](docs/rules/detect-eval-with-expression.md)                     | Detects "eval(variable)" which can allow an attacker to run arbitrary code inside your process.                               | ✅  |
| [detect-new-buffer](docs/rules/detect-new-buffer.md)                                         | Detects instances of new Buffer(argument) where argument is any non-literal value.                                            | ✅  |
| [detect-no-csrf-before-method-override](docs/rules/detect-no-csrf-before-method-override.md) | Detects Express "csrf" middleware setup before "method-override" middleware.                                                  | ✅  |
| [detect-non-literal-fs-filename](docs/rules/detect-non-literal-fs-filename.md)               | Detects variable in filename argument of "fs" calls, which might allow an attacker to access anything on your system.         | ✅  |
| [detect-non-literal-regexp](docs/rules/detect-non-literal-regexp.md)                         | Detects "RegExp(variable)", which might allow an attacker to DOS your server with a long-running regular expression.          | ✅  |
| [detect-non-literal-require](docs/rules/detect-non-literal-require.md)                       | Detects "require(variable)", which might allow an attacker to load and run arbitrary code, or access arbitrary files on disk. | ✅  |
| [detect-object-injection](docs/rules/detect-object-injection.md)                             | Detects "variable[key]" as a left- or right-hand assignment operand.                                                          | ✅  |
| [detect-possible-timing-attacks](docs/rules/detect-possible-timing-attacks.md)               | Detects insecure comparisons (`==`, `!=`, `!==` and `===`), which check input sequentially.                                   | ✅  |
| [detect-pseudoRandomBytes](docs/rules/detect-pseudoRandomBytes.md)                           | Detects if "pseudoRandomBytes()" is in use, which might not give you the randomness you need and expect.                      | ✅  |
| [detect-unsafe-regex](docs/rules/detect-unsafe-regex.md)                                     | Detects potentially unsafe regular expressions, which may take a very long time to run, blocking the event loop.              | ✅  |

<!-- end auto-generated rules list -->

## TypeScript support

Type definitions for this package are managed by [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped). Use [@types/eslint-plugin-security](https://www.npmjs.com/package/@types/eslint-plugin-security) for type checking.

```sh
npm install --save-dev @types/eslint-plugin-security

# OR

yarn add --dev @types/eslint-plugin-security
```
