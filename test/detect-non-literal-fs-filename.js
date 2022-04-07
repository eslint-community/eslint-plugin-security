'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-non-literal-fs-filename';

const tester = new RuleTester();

const invalid = 'var a = fs.open(c)';

const ruleName = 'detect-non-literal-fs-filename';

tester.run(ruleName, Rule, {
  valid: [{ code: "var a = fs.open('test')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found fs.open with non literal argument at index 0' }],
    },
  ],
});
