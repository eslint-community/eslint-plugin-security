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
      errors: [{ message: /Detected potential trojan source attack with unicode bidi introduced in this code/i, line: 3, endLine: 3, column: 26, endColumn: 55 }],
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
      /* end admins only ‮ { ⁦*/
      /* end admins only ‮ 
         { ⁦*/
        `,
      errors: [
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 3, endLine: 3, column: 7, endColumn: 50 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 5, endLine: 5, column: 7, endColumn: 33 },
        { message: /Detected potential trojan source attack with unicode bidi introduced in this comment/i, line: 6, endLine: 7, column: 7, endColumn: 15 },
      ],
    },
  ],
});
