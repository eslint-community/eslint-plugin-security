var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-disable-mustache-escape");


var eslintTester = new RuleTester();


eslintTester.run("detect-disable-mustache-escape", rule, {
  valid: [{ code: "escapeMarkup = false" }],
  invalid: [
    {
      code: "a.escapeMarkup = false",
      errors: [{ message: "Markup escaping disabled." }]
    },
  ]
});
