'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-pseudoRandomBytes';
const invalid = 'crypto.pseudoRandomBytes';

tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [{ code: 'crypto.randomBytes' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers' }]
    }
  ]
});
