'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-non-literal-regexp';
const invalid = "var a = new RegExp(c, 'i')";

tester.run(ruleName, require(`../../rules/${ruleName}`), {
  valid: [
    { code: "var a = new RegExp('ab+c', 'i')" },
    {
      code: `
            var source = 'ab+c'
            var a = new RegExp(source, 'i')`,
    },
    { code: "var a = RegExp('ab+c', 'i')" },
  ],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found non-literal argument to RegExp Constructor' }],
    },
    {
      code: "var a = RegExp(c, 'i')",
      errors: [{ message: 'Found non-literal argument to RegExp Constructor' }],
    },
  ],
});
