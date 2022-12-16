'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-trojan-source';
const Rule = require(`../rules/${ruleName}`);

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
      /* end admins only ‮ \r\n { ⁦*/
        `,
      errors: [
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 7, endColumn: 8 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 11, endColumn: 12 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 24, endColumn: 25 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 26, endColumn: 27 },

        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 5, endLine: 5, column: 24, endColumn: 25 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 6, endLine: 6, column: 1, endColumn: 2 },

        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 7, endLine: 7, column: 24, endColumn: 25 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 8, endLine: 8, column: 4, endColumn: 5 },
      ],
    },
  ],
});
