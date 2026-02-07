import { RuleTester } from 'eslint';
import { detectNewBufferRule, detectNewBufferRuleName } from '../../src/rules/detect-new-buffer.ts';

const tester = new RuleTester();

const invalid = 'var a = new Buffer(c)';

tester.run(detectNewBufferRuleName, detectNewBufferRule, {
  valid: [{ code: "var a = new Buffer('test')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found new Buffer' }],
    },
  ],
});
