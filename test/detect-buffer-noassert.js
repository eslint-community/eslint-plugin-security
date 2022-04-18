'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-buffer-noassert';
const rule = require(`../rules/${ruleName}`);

const allMethodNames = [...rule.meta.__methodsToCheck.read, ...rule.meta.__methodsToCheck.write];

tester.run(ruleName, rule, {
  valid: [...allMethodNames.map((methodName) => `a.${methodName}(0)`), ...allMethodNames.map((methodName) => `a.${methodName}(0, false)`)],
  invalid: [
    ...rule.meta.__methodsToCheck.read.map((methodName) => ({
      code: `a.${methodName}(0, true)`,
      errors: [{ message: `Found Buffer.${methodName} with noAssert flag set true` }],
    })),

    ...rule.meta.__methodsToCheck.write.map((methodName) => ({
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
