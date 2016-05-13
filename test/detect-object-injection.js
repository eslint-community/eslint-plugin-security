var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-object-injection");


var eslintTester = new RuleTester(),
  valid = "var a = {};",
  // invalidVariable = "TODO",
  // invalidFunction = "TODO",
  invalidGeneric = "var a = {}; a[b] = 4";


// TODO
// eslintTester.run("detect-object-injection (Variable Assigned to)", rule, {
//   valid: [{ code: valid }],
//   invalid: [
//     {
//       code: invalidVariable,
//       errors: [{ message: "Variable Assigned to Object Injection Sink: <input>: 1\n\t" + invalidVariable + "\n\n" }]
//     },
//   ]
// });
//
//
// eslintTester.run("detect-object-injection (Function)", rule, {
//   valid: [{ code: valid }],
//   invalid: [
//     {
//       code: invalidFunction,
//       errors: [{ message: "Variable Assigned to Object Injection Sink: <input>: 1\n\t" + invalidFunction + "\n\n" }]
//     },
//   ]
// });


eslintTester.run("detect-object-injection (Generic)", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalidGeneric,
      errors: [{ message: "Generic Object Injection Sink: <input>: 1\n\t" + invalidGeneric + "\n\n" }]
    },
  ]
});
