'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-non-literal-fs-filename';

tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [
    {
      code: 'var a = fs.open(\'test\')'
    },
    {
      code: 'var a = fs.open(__dirname + \'/test\')'
    },
    // { // ES6+
    //   code: 'var a = fs.open(`${__dirname}/test`)'
    // }
  ],
  invalid: [
    {
      code: 'var a = fs.open(c)',
      errors: [{ message: 'Found fs.open with non literal argument at index 0' }]
    },
    {
      code: 'var a = fs.open(\'test\' + __dirname)',
      errors: [{ message: 'Found fs.open with non literal argument at index 0' }]
    },
    {
      code: 'var a = fs.open(__dirname + c + \'test\')',
      errors: [{ message: 'Found fs.open with non literal argument at index 0' }]
    },
    {
      code: 'var a = fs.open(__dirname + \'test\' + c)',
      errors: [{ message: 'Found fs.open with non literal argument at index 0' }]
    },
    // { // ES6+
    //   code: 'var a = fs.open(`${__dirname}${c}/test`)',
    //   errors: [{ message: 'Found fs.open with non literal argument at index 0' }]
    // },
    // {
    //   code: 'var a = fs.open(`test${__dirname}`)',
    //   errors: [{ message: 'Found fs.open with non literal argument at index 0' }]
    // },
    // {
    //   code: 'var a = fs.open(`${__dirname + c}/test`)',
    //   errors: [{ message: 'Found fs.open with non literal argument at index 0' }]
    // }
  ]
});
