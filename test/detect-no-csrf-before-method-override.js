var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-no-csrf-before-method-override");


var eslintTester = new RuleTester();


eslintTester.run("detect-no-csrf-before-method-override", rule, {
  valid: [{ code: "express.methodOverride();express.csrf()" }],
  invalid: [
    {
      code: "express.csrf();express.methodOverride()",
      errors: [{ message: "express.csrf() middleware found before express.methodOverride()" }]
    },
  ]
});
