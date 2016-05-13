var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-disable-mustache-escape");


var valid = "escapeMarkup = false",
  invalid = "a.escapeMarkup = false",

  eslintTester = new RuleTester();


eslintTester.run("detect-disable-mustache-escape", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Markup escaping disabled." }]
    },
  ]
});
