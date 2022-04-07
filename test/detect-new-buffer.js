'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-new-buffer';

const tester = new RuleTester();

const ruleName = 'detect-new-buffer';
const invalid = 'var a = new Buffer(c)';

tester.run(ruleName, Rule, {
  valid: [{ code: "var a = new Buffer('test')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found new Buffer' }],
    },
  ],
});
