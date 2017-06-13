'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-buffer-noassert';
const Rule = require(`../rules/${ruleName}`);

const invalid = 'a.readUInt8(0, true);';


tester.run(ruleName, Rule, {
  valid: [{ code: 'a.readUInt8(0);' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found Buffer.readUInt8 with noAssert flag set true' }]
    }
  ]
});

tester.run(`${ruleName} (false)`, Rule, {
  valid: [{ code: 'a.readUInt8(0, false);' }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: 'Found Buffer.readUInt8 with noAssert flag set true' }]
    }
  ]
});
