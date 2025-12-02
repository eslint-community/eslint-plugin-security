import { RuleTester } from 'eslint';
import { detectUnsafeRegexRule } from '../../rules/detect-unsafe-regex.ts';

const tester = new RuleTester();

export const ruleName = 'detect-unsafe-regex' as const;

tester.run(ruleName, detectUnsafeRegexRule, {
  valid: [{ code: '/^d+1337d+$/' }],
  invalid: [
    {
      code: '/(x+x+)+y/',
      errors: [{ message: 'Unsafe Regular Expression' }],
    },
  ],
});

tester.run(`${ruleName} (new RegExp)`, detectUnsafeRegexRule, {
  valid: [{ code: "new RegExp('^d+1337d+$')" }],
  invalid: [
    {
      code: "new RegExp('x+x+)+y')",
      errors: [{ message: 'Unsafe Regular Expression (new RegExp)' }],
    },
  ],
});
