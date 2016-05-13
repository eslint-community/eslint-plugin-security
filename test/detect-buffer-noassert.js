var RuleTester = require("eslint").RuleTester;

var rule = require("../rules/detect-buffer-noassert");


var eslintTester = new RuleTester(),
  valid = "a.readUInt8(0);",
  invalid = "a.readUInt8(0, true);";


eslintTester.run("detect-buffer-noassert", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found Buffer.readUInt8 with noAssert flag set true:\n\t1:  " + invalid }]
    },
  ]
});

eslintTester.run("detect-buffer-noassert (false)", rule, {
  valid: [{ code: "a.readUInt8(0, false);" }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found Buffer.readUInt8 with noAssert flag set true:\n\t1:  " + invalid }]
    },
  ]
});

eslintTester.run("detect-buffer-noassert", rule, {
  valid: [{ code: valid }],
  invalid: [
    {
      code: invalid,
      errors: [{ message: "Found Buffer.readUInt8 with noAssert flag set true:\n\t1:  " + invalid }]
    },
  ]
});
