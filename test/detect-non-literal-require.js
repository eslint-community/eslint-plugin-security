var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-non-literal-require");


var valid = "var a = require('b')",
  invalid = "var a = require(c)",
  eslintTester = new RuleTester();


eslintTester.run("detect-non-literal-require", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found non-literal argument in require\n\t1:  " + invalid }]
    },
  ]
});
