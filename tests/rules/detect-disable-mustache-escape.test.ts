import { RuleTester } from 'eslint';
import { detectDisableMustacheEscapeRule, detectDisableMustacheEscapeRuleName } from '../../src/rules/detect-disable-mustache-escape.ts';

const tester = new RuleTester();

tester.run(detectDisableMustacheEscapeRuleName, detectDisableMustacheEscapeRule, {
  valid: [{ code: 'escapeMarkup = false' }],
  invalid: [
    {
      code: 'a.escapeMarkup = false',
      errors: [{ message: 'Markup escaping disabled.' }],
    },
  ],
});
