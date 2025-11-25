'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-no-csrf-before-method-override';

tester.run(ruleName, require(`../../rules/${ruleName}`), {
  valid: [{ code: 'express.methodOverride();express.csrf()' }],
  invalid: [
    {
      code: 'express.csrf();express.methodOverride()',
      errors: [{ message: 'express.csrf() middleware found before express.methodOverride()' }],
    },
  ],
});
