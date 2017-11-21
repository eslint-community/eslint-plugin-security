'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-non-literal-require';

tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [
    {
      code: 'var a = require(\'b\')'
    },
    {
      code: 'var a = require(__dirname + \'b\')'
    },
    // { // ES6+
    //   code: 'var a = require(`${__dirname}/b`)'
    // }
  ],
  invalid: [
    {
      code: 'var a = require(c)',
      errors: [{ message: 'Found non-literal argument in require' }]
    },
    {
      code: 'var a = require(\'b\' + __dirname)',
      errors: [{ message: 'Found non-literal argument in require' }]
    },
    {
      code: 'var a = require(__dirname + c + \'b\')',
      errors: [{ message: 'Found non-literal argument in require' }]
    },
    {
      code: 'var a = require(__dirname + \'b\' + c)',
      errors: [{ message: 'Found non-literal argument in require' }]
    },
    // { // ES6+
    //   code: 'var a = require(`${__dirname}${c}/b`)',
    //   errors: [{ message: 'Found non-literal argument in require' }]
    // },
    // {
    //   code: 'var a = require(`b${__dirname}`)',
    //   errors: [{ message: 'Found non-literal argument in require' }]
    // },
    // {
    //     code: 'var a = require(`${__dirname + c}/b`)',
    //   errors: [{ message: 'Found non-literal argument in require' }]
    // }
  ]
});
