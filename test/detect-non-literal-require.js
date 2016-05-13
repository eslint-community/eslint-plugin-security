var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-non-literal-require");


var eslintTester = new RuleTester(),
  invalid = "var a = require(c)";


eslintTester.run("detect-non-literal-require", rule, {
  valid: [{ code: "var a = require('b')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found non-literal argument in require\n\t1:  " + invalid }]
    },
  ]
});
