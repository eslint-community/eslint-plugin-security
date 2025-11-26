import { RuleTester } from 'eslint';
import { detectNoCsrfBeforeMethodOverrideRule } from '../../rules/detect-no-csrf-before-method-override.js';

const tester = new RuleTester();

const ruleName = 'detect-no-csrf-before-method-override';

tester.run(ruleName, detectNoCsrfBeforeMethodOverrideRule, {
  valid: [{ code: 'express.methodOverride();express.csrf()' }],
  invalid: [
    {
      code: 'express.csrf();express.methodOverride()',
      errors: [{ message: 'express.csrf() middleware found before express.methodOverride()' }],
    },
  ],
});
