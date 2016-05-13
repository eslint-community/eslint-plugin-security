var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-non-literal-regexp");


var valid = "var a = new RegExp('ab+c', 'i')",
  invalid = "var a = new RegExp(c, 'i')",
  eslintTester = new RuleTester();


eslintTester.run("detect-non-literal-regexp", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found non-literal argument to RegExp Constructor\n\t1:  " + invalid }]
    },
  ]
});
