'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-possible-timing-attacks';

const tester = new RuleTester();

const ruleName = 'detect-possible-timing-attacks';

const valid = 'if (age === 5) {}';
const invalidLeft = "if (password === 'mypass') {}";
const invalidRigth = "if ('mypass' === password) {}";

// We only check with one string "password" and operator "==="
// to KISS.

tester.run(`${ruleName} (left side)`, Rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidLeft,
      errors: [{ message: 'Potential timing attack, left side: true' }],
    },
  ],
});

tester.run(`${ruleName} (right side)`, Rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidRigth,
      errors: [{ message: 'Potential timing attack, right side: true' }],
    },
  ],
});
