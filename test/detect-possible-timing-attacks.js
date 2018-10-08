'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-possible-timing-attacks';
const Rule = require(`../rules/${ruleName}`);


// We only check with one string "password" and operator "==="
// to KISS.

tester.run(`${ruleName} (left side)`, Rule, {
  valid: [
    { code: 'if (age === 5) {}' },
    { code: 'if (password === 5) {}' },
    { code: 'password.toString() === true' },
    { code: 'if (user.password === true) {}' },
    { code: 'if (user["password"] === true) {}' }
  ],
  invalid: [
    {
      code: 'if (password === \'mypass\') {}',
      errors: [{ message: 'Potential timing attack, left side: true' }]
    },
    {
      code: 'password.toString() === \'mypass\'',
      errors: [{ message: 'Potential timing attack, left side: true' }]
    },
    {
      code: 'if (user.password === \'mypass\') {}',
      errors: [{ message: 'Potential timing attack, left side: true' }]
    },
    {
      code: 'if (user["password"] === \'mypass\') {}',
      errors: [{ message: 'Potential timing attack, left side: true' }]
    },
    {
      code: 'if (password === getFromDatabase()) {}',
      errors: [{ message: 'Potential timing attack, left side: true' }]
    }

  ]
});


tester.run(`${ruleName} (right side)`, Rule, {
  valid: [
    { code: 'if (5 === age) {}' },
    { code: 'if (5 === password) {}' },
    { code: 'true === password.toString()' },
    { code: 'if (true === user.password) {}' },
    { code: 'if (true === user["password"]) {}' }
  ],
  invalid: [
    {
      code: 'if (\'mypass\' === password) {}',
      errors: [{ message: 'Potential timing attack, right side: true' }]
    },
    {
      code: '\'mypass\' === password.toString()',
      errors: [{ message: 'Potential timing attack, right side: true' }]
    },
    {
      code: 'if (\'mypass\' === user.password) {}',
      errors: [{ message: 'Potential timing attack, right side: true' }]
    },
    {
      code: 'if (\'mypass\' === user["password"]) {}',
      errors: [{ message: 'Potential timing attack, right side: true' }]
    },
    {
      code: 'if (getFromDatabase() === password) {}',
      errors: [{ message: 'Potential timing attack, right side: true' }]
    }
  ]
});
