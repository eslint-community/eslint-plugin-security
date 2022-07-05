'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const invalid = 'var a = fs.open(c)';

const ruleName = 'detect-non-literal-fs-filename';

tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [{ code: "var a = fs.open('test')" }, { code: 'var a = foo.open(c)' }, { code: 'var foo = { link: function (z) { return z } }; var bar = true; foo.link(bar);' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found fs.open with non literal argument at index 0' }],
    },
  ],
});
