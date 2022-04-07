'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-non-literal-require.js';

const tester = new RuleTester();

const ruleName = 'detect-non-literal-require';
const invalid = 'var a = require(c)';

tester.run(ruleName, Rule, {
  valid: [{ code: "var a = require('b')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found non-literal argument in require' }],
    },
  ],
});
