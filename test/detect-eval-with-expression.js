var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-eval-with-expression");


var eslintTester = new RuleTester();


eslintTester.run("detect-eval-with-expression", rule, {
  valid: [{ code: "eval('alert()')" }],
  invalid: [
    {
      code: "eval(a);",
      errors: [{ message: "eval with argument of type Identifier" }]
    },
  ]
});
