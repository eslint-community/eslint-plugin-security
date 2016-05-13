var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-new-buffer");


var eslintTester = new RuleTester(),
    invalid = "var a = new Buffer(c)";


eslintTester.run("detect-new-buffer", rule, {
  valid: [{ code: "var a = new Buffer('test')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found new Buffer\n\t1:  " + invalid }]
    },
  ]
});
