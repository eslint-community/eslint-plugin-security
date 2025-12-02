import { RuleTester } from 'eslint';
import { detectDisableMustacheEscapeRule } from '../../src/rules/detect-disable-mustache-escape.ts';

const tester = new RuleTester();

const ruleName = 'detect-disable-mustache-escape';

tester.run(ruleName, detectDisableMustacheEscapeRule, {
  valid: [{ code: 'escapeMarkup = false' }],
  invalid: [
    {
      code: 'a.escapeMarkup = false',
      errors: [{ message: 'Markup escaping disabled.' }],
    },
  ],
});
