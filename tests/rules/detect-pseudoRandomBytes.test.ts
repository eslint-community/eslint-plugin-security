import { RuleTester } from 'eslint';
import { detectPseudoRandomBytesRule, detectPseudoRandomBytesRuleName } from '../../src/rules/detect-pseudoRandomBytes.ts';

const tester = new RuleTester();

const invalid = 'crypto.pseudoRandomBytes';

tester.run(detectPseudoRandomBytesRuleName, detectPseudoRandomBytesRule, {
  valid: [{ code: 'crypto.randomBytes' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers' }],
    },
  ],
});
