'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-eval-with-expression';

tester.run(ruleName, require(`../../rules/${ruleName}`), {
  valid: [{ code: "eval('alert()')" }, { code: 'eval("some nefarious code");' }, { code: 'eval()' }],
  invalid: [
    {
      code: 'eval(a);',
      errors: [{ message: 'eval with argument of type Identifier' }],
    },
  ],
});
