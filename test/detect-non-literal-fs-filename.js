var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-non-literal-fs-filename");


var eslintTester = new RuleTester(),
  invalid = "var a = fs.open(c)";


eslintTester.run("detect-non-literal-fs-filename", rule, {
  valid: [{ code: "var a = fs.open('test')" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found fs.open with non literal argument at index 0\n\t1:  " + invalid }]
    },
  ]
});
