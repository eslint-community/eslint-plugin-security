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
    { code: "var a = new RegExp(RegExp.escape(c), 'i')" },
    { code: "var a = new RegExp(`(${RegExp.escape(c)})$`, 'iv')" },
    { code: "var a = new RegExp(`^prefix${RegExp.escape(c)}` + RegExp.escape(d), 'i')" },
  ],
  invalid: [
    {
      code: invalid,
      errors: [
        {
          message: 'Found non-literal argument to RegExp Constructor',
          suggestions: [
            {
              desc: 'Escape the dynamic parts with RegExp.escape()',
              output: "var a = new RegExp(RegExp.escape(c), 'i')",
            },
          ],
        },
      ],
    },
    {
      code: "var a = new RegExp(`(${c})$`, 'iv')",
      errors: [
        {
          message: 'Found non-literal argument to RegExp Constructor',
          suggestions: [
            {
              desc: 'Escape the dynamic parts with RegExp.escape()',
              output: "var a = new RegExp(`(${RegExp.escape(c)})$`, 'iv')",
            },
          ],
        },
      ],
    },
    {
      // `RegExp` is shadowed, so its `escape` is not the built-in one.
      code: 'function compile(RegExp, input) { return new RegExp(RegExp.escape(input)); }',
      errors: [
        {
          message: 'Found non-literal argument to RegExp Constructor',
          suggestions: [
            {
              desc: 'Escape the dynamic parts with RegExp.escape()',
              output: 'function compile(RegExp, input) { return new RegExp(RegExp.escape(RegExp.escape(input))); }',
            },
          ],
        },
      ],
    },
    {
      // A sequence expression keeps its grouping when it is wrapped.
      code: 'var a = new RegExp((audit(), input))',
      errors: [
        {
          message: 'Found non-literal argument to RegExp Constructor',
          suggestions: [
            {
              desc: 'Escape the dynamic parts with RegExp.escape()',
              output: 'var a = new RegExp((RegExp.escape((audit(), input))))',
            },
          ],
        },
      ],
    },
    {
      // A spread may also carry the constructor flags, so no suggestion is offered.
      code: "var args = [source, 'i']; var a = new RegExp(...args)",
      errors: [{ message: 'Found non-literal argument to RegExp Constructor', suggestions: [] }],
    },
    {
      code: "var a = new RegExp(`(${RegExp.escape(c)}|${d})$`, 'iv')",
      errors: [
        {
          message: 'Found non-literal argument to RegExp Constructor',
          suggestions: [
            {
              desc: 'Escape the dynamic parts with RegExp.escape()',
              output: "var a = new RegExp(`(${RegExp.escape(c)}|${RegExp.escape(d)})$`, 'iv')",
            },
          ],
        },
      ],
    },
  ],
});
