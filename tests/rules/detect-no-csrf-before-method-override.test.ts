import { RuleTester } from 'eslint';
import { detectNoCsrfBeforeMethodOverrideRule } from '../../src/rules/detect-no-csrf-before-method-override.ts';

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
