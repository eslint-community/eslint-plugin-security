'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-possible-timing-attacks';
const Rule = require(`../../rules/${ruleName}`);

// We only check with one string "password" and operator "==="
// to KISS.

tester.run(ruleName, Rule, {
  valid: [{ code: 'if (age === 5) {}' }],
  invalid: [
    {
      code: 'if (password === "mypass") {}',
      errors: [{ message: 'Potential timing attack, left side: password' }],
    },
    {
      code: 'if ("mypass" === password) {}',
      errors: [{ message: 'Potential timing attack, right side: password' }],
    },
  ],
});
