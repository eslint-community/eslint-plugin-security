import { RuleTester } from 'eslint';
import { detectEvalWithExpressionRule } from '../../src/rules/detect-eval-with-expression.ts';

const tester = new RuleTester();

const ruleName = 'detect-eval-with-expression';

tester.run(ruleName, detectEvalWithExpressionRule, {
  valid: [{ code: "eval('alert()')" }, { code: 'eval("some nefarious code");' }, { code: 'eval()' }],
  invalid: [
    {
      code: 'eval(a);',
      errors: [{ message: 'eval with argument of type Identifier' }],
    },
  ],
});
