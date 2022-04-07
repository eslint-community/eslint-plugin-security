'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-eval-with-expression.js';

const tester = new RuleTester();

const ruleName = 'detect-eval-with-expression';

tester.run(ruleName, Rule, {
  valid: [{ code: "eval('alert()')" }],
  invalid: [
    {
      code: 'eval(a);',
      errors: [{ message: 'eval with argument of type Identifier' }],
    },
  ],
});
