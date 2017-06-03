'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-non-literal-require';
const invalid = 'var a = require(c)';


tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [{ code: 'var a = require(\'b\')' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found non-literal argument in require' }]
    }
  ]
});
