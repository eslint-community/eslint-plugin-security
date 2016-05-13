var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-unsafe-regex");


var eslintTester = new RuleTester();


eslintTester.run("detect-unsafe-regex", rule, {
  valid: [{ code: "/^\d+1337\d+$/" }],
  invalid: [
    {
      code: "/(x+x+)+y/",
      errors: [{ message: "Unsafe Regular Expression" }]
    },
  ]
});


eslintTester.run("detect-unsafe-regex (new RegExp)", rule, {
  valid: [{ code: "new RegExp('^\d+1337\d+$')" }],
  invalid: [
    {
      code: "new RegExp('x+x+)+y')",
      errors: [{ message: "Unsafe Regular Expression (new RegExp)" }]
    },
  ]
});
