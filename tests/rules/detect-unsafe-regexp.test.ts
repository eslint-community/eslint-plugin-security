import { RuleTester } from 'eslint';
import { detectUnsafeRegexRule, detectUnsafeRegexRuleName } from '../../src/rules/detect-unsafe-regex.ts';

const tester = new RuleTester();

tester.run(detectUnsafeRegexRuleName, detectUnsafeRegexRule, {
  valid: [{ code: '/^d+1337d+$/' }],
  invalid: [
    {
      code: '/(x+x+)+y/',
      errors: [{ message: 'Unsafe Regular Expression' }],
    },
  ],
});

tester.run(`${detectUnsafeRegexRuleName} (new RegExp)`, detectUnsafeRegexRule, {
  valid: [{ code: "new RegExp('^d+1337d+$')" }],
  invalid: [
    {
      code: "new RegExp('x+x+)+y')",
      errors: [{ message: 'Unsafe Regular Expression (new RegExp)' }],
    },
  ],
});
