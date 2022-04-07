'use strict';

import { RuleTester } from 'eslint';

const tester = new RuleTester();

const ruleName = 'detect-unsafe-regex';
import Rule from '../rules/detect-unsafe-regex';

tester.run(ruleName, Rule, {
  valid: [{ code: '/^d+1337d+$/' }],
  invalid: [
    {
      code: '/(x+x+)+y/',
      errors: [{ message: 'Unsafe Regular Expression' }],
    },
  ],
});

tester.run(`${ruleName} (new RegExp)`, Rule, {
  valid: [{ code: "new RegExp('^d+1337d+$')" }],
  invalid: [
    {
      code: "new RegExp('x+x+)+y')",
      errors: [{ message: 'Unsafe Regular Expression (new RegExp)' }],
    },
  ],
});
