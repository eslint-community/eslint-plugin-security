var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-non-literal-regexp");


var eslintTester = new RuleTester(),
  invalid = "var a = new RegExp(c, 'i')";


eslintTester.run("detect-non-literal-regexp", rule, {
  valid: [{ code: "var a = new RegExp('ab+c', 'i')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found non-literal argument to RegExp Constructor\n\t1:  " + invalid }]
    },
  ]
});
