'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-bidi-characters';
const Rule = require(`../../rules/${ruleName}`);

tester.run(ruleName, Rule, {
  valid: [
    {
      code: `
  var accessLevel = "user";
  if (accessLevel != "user") { // Check if admin
    console.log("You are an admin.");
  }
  `,
    },
  ],
  invalid: [
    {
      code: `
      var accessLevel = "user";
      if (accessLevel != "user‮ ⁦// Check if admin⁩ ⁦") {
          console.log("You are an admin.");
      }
      `,
      errors: [
        { message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 3, endLine: 3, column: 31, endColumn: 32 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 3, endLine: 3, column: 33, endColumn: 34 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 3, endLine: 3, column: 51, endColumn: 52 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 3, endLine: 3, column: 53, endColumn: 54 },
      ],
    },
    {
      name: 'line terminator: LF (\\n)',
      code: 'var t = `a\nX\u202E`;',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: CRLF (\\r\\n)',
      code: 'var t = `a\r\nX\u202E`;',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: CR (\\r)',
      code: 'var t = `a\rX\u202E`;',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: LS (\\u2028)',
      code: 'var t = `a\u2028X\u202E`;',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: PS (\\u2029)',
      code: 'var t = `a\u2029X\u202E`;',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
  ],
});

tester.run(`${ruleName} in comment-line`, Rule, {
  valid: [
    {
      code: `
  var isAdmin = false;
  /* begin admins only */ if (isAdmin) {
    console.log("You are an admin.");
  /* end admins only */ }
  `,
    },
  ],
  invalid: [
    {
      code: `
      var isAdmin = false;
      /*‮ } ⁦if (isAdmin)⁩ ⁦ begin admins only */
          console.log("You are an admin.");
      /* end admins only ‮
⁦*/
      /* end admins only ‮
 { ⁦*/
        `,
      errors: [
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 9, endColumn: 10 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 13, endColumn: 14 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 26, endColumn: 27 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 28, endColumn: 29 },

        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 5, endLine: 5, column: 26, endColumn: 27 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 6, endLine: 6, column: 1, endColumn: 2 },

        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 7, endLine: 7, column: 26, endColumn: 27 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 8, endLine: 8, column: 4, endColumn: 5 },
      ],
    },
    {
      name: 'line terminator: LF (\\n)',
      code: '/* a\nX\u202E */',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: CRLF (\\r\\n)',
      code: '/* a\r\nX\u202E */',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: CR (\\r)',
      code: '/* a\rX\u202E */',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: LS (\\u2028)',
      code: '/* a\u2028X\u202E */',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
    {
      name: 'line terminator: PS (\\u2029)',
      code: '/* a\u2029X\u202E */',
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 2, endLine: 2, column: 2, endColumn: 3 }],
    },
  ],
});
