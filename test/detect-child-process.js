'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-child-process';
const rule = require(`../rules/${ruleName}`);

tester.run(ruleName, rule, {
  valid: [
    "child_process.exec('ls')",
    {
      code: `
      var {} = require('child_process');
      var result = /hello/.exec(str);`,
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: "var { spawn } = require('child_process'); spawn(str);",
      parserOptions: { ecmaVersion: 6 },
    },
  ],
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
    {
      code: "var child = sinon.stub(require('child_process')); child.exec.returns({});",
      errors: [{ message: 'Found require("child_process")' }],
    },
    {
      code: `
      var foo = require('child_process');
      function fn () {
        var result = foo.exec(str);
      }`,
      errors: [
        { message: 'Found require("child_process")', line: 2 },
        { message: 'Found child_process.exec() with non Literal first argument', line: 4 },
      ],
    },
    {
      code: `
      var foo = require('child_process');
      function fn () {
        var foo = /hello/;
        var result = foo.exec(str);
      }`,
      errors: [{ message: 'Found require("child_process")', line: 2 }],
    },
  ],
});
