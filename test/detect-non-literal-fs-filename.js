var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-non-literal-fs-filename");


var valid = "var a = fs.open('test')",
  invalid = "var a = fs.open(c)",
  eslintTester = new RuleTester();


eslintTester.run("detect-non-literal-fs-filename", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found fs.open with non literal argument at index 0\n\t1:  " + invalid }]
    },
  ]
});
