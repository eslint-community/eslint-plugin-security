# eslint-plugin-security

ESLint rules for Node Security

This project will help identify potential security hotspots, but finds a lot of false positives which need triage by a human.

### Installation

`npm install --save-dev eslint-plugin-security` or `yarn add eslint-plugin-security --dev`

### Usage

Add the following to your `.eslintrc` file:

```js
"extends": [
  "plugin:security/recommended"
]
```

## Developer guide

- Use [GitHub pull requests](https://help.github.com/articles/using-pull-requests).
- Conventions:
- We use our [custom ESLint setup](https://github.com/nodesecurity/eslint-config-nodesecurity).
- Please implement a test for each new rule and use this command to be sure the new code respects the style guide and the tests keep passing:

```sh
npm run-script cont-int
```

### Tests

```sh
npm test
```

### Rules

#### `detect-unsafe-regex`

Locates potentially unsafe regular expressions, which may take a very long time to run, blocking the event loop.

More information: [Regular Expression DoS and Node.js](docs/regular-expression-dos-and-node.md)

#### `detect-buffer-noassert`

Detect calls to [`buffer`](https://nodejs.org/api/buffer.html) with `noAssert` flag set.

From the Node.js API docs: "Setting `noAssert` to true skips validation of the `offset`. This allows the `offset` to be beyond the end of the `Buffer`."

#### `detect-child-process`

Detect instances of [`child_process`](https://nodejs.org/api/child_process.html) & non-literal [`exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)

More information: [Avoiding Command Injection in Node.js](docs/avoid-command-injection-node.md)

#### `detect-disable-mustache-escape`

Detects `object.escapeMarkup = false`, which can be used with some template engines to disable escaping of HTML entities. This can lead to Cross-Site Scripting (XSS) vulnerabilities.

More information: [OWASP XSS](<https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)>)

#### `detect-eval-with-expression`

Detects `eval(variable)` which can allow an attacker to run arbitrary code inside your process.

More information: [What are the security issues with eval in JavaScript?](http://security.stackexchange.com/questions/94017/what-are-the-security-issues-with-eval-in-javascript)

#### `detect-no-csrf-before-method-override`

Detects Express `csrf` middleware setup before `method-override` middleware. This can allow `GET` requests (which are not checked by `csrf`) to turn into `POST` requests later.

More information: [Bypass Connect CSRF protection by abusing methodOverride Middleware](docs/bypass-connect-csrf-protection-by-abusing.md)

#### `detect-non-literal-fs-filename`

Detects variable in filename argument of `fs` calls, which might allow an attacker to access anything on your system.

More information: [OWASP Path Traversal](https://www.owasp.org/index.php/Path_Traversal)

#### `detect-non-literal-regexp`

Detects `RegExp(variable)`, which might allow an attacker to DOS your server with a long-running regular expression.

More information: [Regular Expression DoS and Node.js](docs/regular-expression-dos-and-node.md)

#### `detect-non-literal-require`

Detects `require(variable)`, which might allow an attacker to load and run arbitrary code, or access arbitrary files on disk.

More information: [Where does Node.js and require look for modules?](http://www.bennadel.com/blog/2169-where-does-node-js-and-require-look-for-modules.htm)

#### `detect-object-injection`

Detects `variable[key]` as a left- or right-hand assignment operand.

More information: [The Dangers of Square Bracket Notation](docs/the-dangers-of-square-bracket-notation.md)

#### `detect-possible-timing-attacks`

Detects insecure comparisons (`==`, `!=`, `!==` and `===`), which check input sequentially.

More information: [A lesson in timing attacks](https://codahale.com/a-lesson-in-timing-attacks/)

#### `detect-pseudoRandomBytes`

Detects if `pseudoRandomBytes()` is in use, which might not give you the randomness you need and expect.

More information: [Randombytes vs pseudorandombytes](http://stackoverflow.com/questions/18130254/randombytes-vs-pseudorandombytes)

#### `detect-new-buffer`

Detect instances of new Buffer(argument) where argument is any non-literal value.
