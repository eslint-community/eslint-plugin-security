# eslint-plugin-security
ESLint rules for Node Security

### Installation

`npm install --save-dev eslint-plugin-security`

### Usage

Add the following to your `.eslintrc` file:

```js
"plugins": [
  "security"
]
```
### Rules

- `detect-unsafe-regex` - Locates potentially unsafe regular expressions
- `detect-buffer-noassert` - Detects calls to buffer with noassert flag set
- `detect-child-process` - Detects instances of child_process & non-literal cp.exec()
- `detect-disable-mustache-escape` -
- `detect-eval-with-expression` - Detects eval(var)
- `detect-no-csrf-before-method-override` - Detects Express.csrf before method-override
- `detect-non-literal-fs-filename` - Detects var in filename argument of fs calls
- `detect-non-literal-regexp` - Detects RegExp(var)
- `detect-non-literal-require` - Detects require(var)
- `detect-object-injection` - Detects var[var]
- `detect-possible-timing-attacks` - Detects insecure comparisons (== != !== ===)
- `detect-pseudoRandomBytes` - Detects if pseudoRandomBytes() is in use

