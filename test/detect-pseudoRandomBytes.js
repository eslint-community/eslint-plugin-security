'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-pseudoRandomBytes.js';

const tester = new RuleTester();

const ruleName = 'detect-pseudoRandomBytes';
const invalid = 'crypto.pseudoRandomBytes';

tester.run(ruleName, Rule, {
  valid: [{ code: 'crypto.randomBytes' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers' }],
    },
  ],
});
