import { RuleTester } from 'eslint';
import { detectNonLiteralRequireRule, detectNonLiteralRequireRuleName } from '../../src/rules/detect-non-literal-require.ts';

const tester = new RuleTester({ languageOptions: { sourceType: 'commonjs' } });

tester.run(detectNonLiteralRequireRuleName, detectNonLiteralRequireRule, {
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
      languageOptions: {
        globals: {
          __dirname: 'readonly',
        },
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
