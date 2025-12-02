import { RuleTester } from 'eslint';
import { detectPseudoRandomBytesRule } from '../../src/rules/detect-pseudoRandomBytes.ts';

const tester = new RuleTester();

const ruleName = 'detect-pseudoRandomBytes';
const invalid = 'crypto.pseudoRandomBytes';

tester.run(ruleName, detectPseudoRandomBytesRule, {
  valid: [{ code: 'crypto.randomBytes' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers' }],
    },
  ],
});
