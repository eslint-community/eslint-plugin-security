'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-child-process';
const rule = require(`../rules/${ruleName}`);

tester.run(ruleName, rule, {
  valid: ["child_process.exec('ls')"],
  invalid: [
    {
      code: "require('child_process')",
      errors: [{ message: 'Found require("child_process")' }],
    },
    {
      code: "var child = require('child_process'); child.exec(com)",
      errors: [{ message: 'Found require("child_process")' }, { message: 'Found child_process.exec() with non Literal first argument' }],
    },
    {
      code: "var child = require('child_process'); child.exec()",
      errors: [{ message: 'Found require("child_process")' }],
    },
  ],
});
