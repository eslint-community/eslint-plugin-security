var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-new-buffer");


var valid = "var a = new Buffer('test')",
  invalid = "var a = new Buffer(c)",
  eslintTester = new RuleTester();


eslintTester.run("detect-new-buffer", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found new Buffer\n\t1:  " + invalid }]
    },
  ]
});
