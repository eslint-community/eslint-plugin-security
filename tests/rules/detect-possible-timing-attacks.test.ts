import { RuleTester } from 'eslint';
import { detectPossibleTimingAttacksRule, detectPossibleTimingAttacksRuleName } from '../../src/rules/detect-possible-timing-attacks.ts';

const tester = new RuleTester();

const valid = 'if (age === 5) {}';
const invalidLeft = "if (password === 'mypass') {}";
const invalidRigth = "if ('mypass' === password) {}";

// We only check with one string "password" and operator "==="
// to KISS.

tester.run(`${detectPossibleTimingAttacksRuleName} (left side)`, detectPossibleTimingAttacksRule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidLeft,
      errors: [{ message: 'Potential timing attack, left side: true' }],
    },
  ],
});

tester.run(`${detectPossibleTimingAttacksRuleName} (right side)`, detectPossibleTimingAttacksRule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidRigth,
      errors: [{ message: 'Potential timing attack, right side: true' }],
    },
  ],
});
