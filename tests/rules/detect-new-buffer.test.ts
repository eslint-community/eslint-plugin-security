import { RuleTester } from 'eslint';
import { detectNewBufferRule } from '../../src/rules/detect-new-buffer.ts';

const tester = new RuleTester();

const ruleName = 'detect-new-buffer';
const invalid = 'var a = new Buffer(c)';

tester.run(ruleName, detectNewBufferRule, {
  valid: [{ code: "var a = new Buffer('test')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found new Buffer' }],
    },
  ],
});
