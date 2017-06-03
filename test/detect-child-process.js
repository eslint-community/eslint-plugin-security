'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-child-process';
const Rule = require(`../rules/${ruleName}`);

const valid = 'child_process.exec(\'ls\')';
const invalidRequire = 'require(\'child_process\')';
const invalidExec = 'var child = require(\'child_process\'); child.exec(com)';


tester.run(`${ruleName} (require("child_process"))`, Rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidRequire,
      errors: [{ message: 'Found require("child_process")' }]
    }
  ]
});


tester.run(`${ruleName} (child_process.exec() wih non literal 1st arg.)`, Rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidExec,
      errors: [
        { message: 'Found require("child_process")' },
        { message: 'Found child_process.exec() with non Literal first argument' }]
    }
  ]
});
