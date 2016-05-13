var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-no-csrf-before-method-override");


var valid = "express.methodOverride();express.csrf()",
  invalid = "express.csrf();express.methodOverride()",
  eslintTester = new RuleTester();


eslintTester.run("detect-no-csrf-before-method-override", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "express.csrf() middleware found before express.methodOverride()" }]
    },
  ]
});
