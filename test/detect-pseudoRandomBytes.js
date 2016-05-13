var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-pseudoRandomBytes");


var valid = "crypto.randomBytes",
  invalid = "crypto.pseudoRandomBytes",
  eslintTester = new RuleTester();


eslintTester.run("detect-pseudoRandomBytes", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers:\n\t1:  " + invalid }]
    },
  ]
});
