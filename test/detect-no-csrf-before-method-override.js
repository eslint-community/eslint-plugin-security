'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-no-csrf-before-method-override';

const tester = new RuleTester();

const ruleName = 'detect-no-csrf-before-method-override';

tester.run(ruleName, Rule, {
  valid: [{ code: 'express.methodOverride();express.csrf()' }],
  invalid: [
    {
      code: 'express.csrf();express.methodOverride()',
      errors: [{ message: 'express.csrf() middleware found before express.methodOverride()' }],
    },
  ],
});
