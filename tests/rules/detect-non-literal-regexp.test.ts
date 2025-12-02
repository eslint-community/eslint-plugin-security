import { RuleTester } from 'eslint';
import { detectNonLiteralRegExpRule, detectNonLiteralRegExpRuleName } from '../../src/rules/detect-non-literal-regexp.ts';

const tester = new RuleTester();

const invalid = "var a = new RegExp(c, 'i')";

tester.run(detectNonLiteralRegExpRuleName, detectNonLiteralRegExpRule, {
  valid: [
    { code: "var a = new RegExp('ab+c', 'i')" },
    {
      code: `
            var source = 'ab+c'
            var a = new RegExp(source, 'i')`,
    },
  ],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found non-literal argument to RegExp Constructor' }],
    },
  ],
});
