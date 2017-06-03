'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-non-literal-regexp';
const invalid = 'var a = new RegExp(c, \'i\')';


tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [{ code: 'var a = new RegExp(\'ab+c\', \'i\')' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found non-literal argument to RegExp Constructor' }]
    }
  ]
});
