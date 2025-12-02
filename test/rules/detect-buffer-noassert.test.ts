import { RuleTester } from 'eslint';
import { detectBufferNoAssertRule } from '../../rules/detect-buffer-noassert.ts';

const tester = new RuleTester();
const ruleName = 'detect-buffer-noassert';

const allMethodNames = [...detectBufferNoAssertRule.meta.__methodsToCheck.read, ...detectBufferNoAssertRule.meta.__methodsToCheck.write];

tester.run(ruleName, detectBufferNoAssertRule, {
  valid: [...allMethodNames.map((methodName) => `a.${methodName}(0)`), ...allMethodNames.map((methodName) => `a.${methodName}(0, false)`)],
  invalid: [
    ...detectBufferNoAssertRule.meta.__methodsToCheck.read.map((methodName) => ({
      code: `a.${methodName}(0, true)`,
      errors: [{ message: `Found Buffer.${methodName} with noAssert flag set true` }],
    })),

    ...detectBufferNoAssertRule.meta.__methodsToCheck.write.map((methodName) => ({
      code: `a.${methodName}(0, 0, true)`,
      errors: [{ message: `Found Buffer.${methodName} with noAssert flag set true` }],
    })),

    // hard-coded test to ensure #63 is fixed
    {
      code: 'a.readDoubleLE(0, true);',
      errors: [{ message: 'Found Buffer.readDoubleLE with noAssert flag set true' }],
    },
  ],
});
