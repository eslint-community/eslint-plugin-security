var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-possible-timing-attacks");


var eslintTester = new RuleTester(),
  valid = "if (age === 5) {}",
  invalidLeft = "if (password === 'mypass') {}",
  invalidRigth = "if ('mypass' === password) {}";


// We only check with one string "password" and operator "==="
// to KISS.

eslintTester.run("detect-detect-possible-timing-attacks (left side)", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidLeft,
      errors: [{ message: "Potential timing attack, left side: true\n\t1:  " + invalidLeft }]
    },
  ]
});


eslintTester.run("detect-detect-possible-timing-attacks (right side)", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidRigth,
      errors: [{ message: "Potential timing attack, right side: true\n\t1:  " + invalidRigth }]
    },
  ]
});
