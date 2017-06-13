'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-disable-mustache-escape';

tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [{ code: 'escapeMarkup = false' }],
  invalid: [
    {
      code: 'a.escapeMarkup = false',
      errors: [{ message: 'Markup escaping disabled.' }]
    }
  ]
});
