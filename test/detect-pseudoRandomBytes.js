var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-pseudoRandomBytes");


var eslintTester = new RuleTester(),
  invalid = "crypto.pseudoRandomBytes";


eslintTester.run("detect-pseudoRandomBytes", rule, {
  valid: [{ code: "crypto.randomBytes" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers:\n\t1:  " + invalid }]
    },
  ]
});
