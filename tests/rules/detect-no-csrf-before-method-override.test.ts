import { RuleTester } from 'eslint';
import { detectNoCsrfBeforeMethodOverrideRule, detectNoCsrfBeforeMethodOverrideRuleName } from '../../src/rules/detect-no-csrf-before-method-override.ts';

const tester = new RuleTester();

tester.run(detectNoCsrfBeforeMethodOverrideRuleName, detectNoCsrfBeforeMethodOverrideRule, {
  valid: [{ code: 'express.methodOverride();express.csrf()' }],
  invalid: [
    {
      code: 'express.csrf();express.methodOverride()',
      errors: [{ message: 'express.csrf() middleware found before express.methodOverride()' }],
    },
  ],
});
