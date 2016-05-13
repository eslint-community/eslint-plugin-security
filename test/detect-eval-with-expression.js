var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-eval-with-expression");


var valid = "eval('alert()')",
  invalid = "eval(a);",
  eslintTester = new RuleTester();


eslintTester.run("detect-eval-with-expression", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "eval with argument of type Identifier" }]
    },
  ]
});
