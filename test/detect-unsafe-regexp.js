var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-unsafe-regex");


var valid = "/^\d+1337\d+$/",
  invalid = "/(x+x+)+y/",
  eslintTester = new RuleTester();


eslintTester.run("detect-unsafe-regex", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Unsafe Regular Expression" }]
    },
  ]
});


valid = "new RegExp('^\d+1337\d+$')";
invalid = "new RegExp('x+x+)+y')";

eslintTester.run("detect-unsafe-regex (new RegExp)", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Unsafe Regular Expression (new RegExp)" }]
    },
  ]
});
