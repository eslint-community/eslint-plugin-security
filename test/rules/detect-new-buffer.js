'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-new-buffer';
const invalid = 'var a = new Buffer(c)';

tester.run(ruleName, require(`../../rules/${ruleName}`), {
  valid: [{ code: "var a = new Buffer('test')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found new Buffer' }],
    },
  ],
});
