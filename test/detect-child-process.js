var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-child-process");


var valid = "child_process.exec('ls')",
  invalidRequire = "require('child_process')",
  invalidExec= "var child = require('child_process'); child.exec(com)",
  eslintTester = new RuleTester();


eslintTester.run("detect-child-process (require('child_process'))", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidRequire,
      errors: [{ message: "Found require(\"child_process\")\n\t1:  " + invalidRequire }]
    },
  ]
});


eslintTester.run("detect-child-process (child_process.exec() wih non literal 1st arg.)", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidExec,
      errors: [
        { message: "Found require(\"child_process\")\n\t1:  " + invalidExec },
        { message: "Found child_process.exec() with non Literal first argument\n\t1:  " + invalidExec }]
    },
  ]
});
