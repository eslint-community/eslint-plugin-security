'use strict';

const RuleTester = require('eslint').RuleTester;

const tester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const ruleName = 'detect-non-literal-require';

tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [
    { code: "var a = require('b')" },
    { code: 'var a = require(`b`)' },
    {
      code: `
  const d = 'debounce'
  var a = require(\`lodash/\${d}\`)`,
    },
    {
      code: "const utils = require(__dirname + '/utils');",
      globals: {
        __dirname: 'readonly',
      },
    },
  ],
  invalid: [
    {
      code: 'var a = require(c)',
      errors: [{ message: 'Found non-literal argument in require' }],
    },
    {
      code: 'var a = require(`${c}`)',
      errors: [{ message: 'Found non-literal argument in require' }],
    },
  ],
});
