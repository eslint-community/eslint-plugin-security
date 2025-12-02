/**
 * Tries to detect calls to require with non-literal argument
 * @author Adam Baldwin
 */

import { isStaticExpression } from '../utils/is-static-expression.ts';
import type { RuleModule } from '../utils/typeHelpers.ts';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const detectNonLiteralRequireRuleName = 'detect-non-literal-require' as const;

export const detectNonLiteralRequireRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects "require(variable)", which might allow an attacker to load and run arbitrary code, or access arbitrary files on disk.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-require.md',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      CallExpression(node) {
        if ('name' in node.callee && node.callee.name === 'require') {
          const args = node.arguments;
          // TODO: Double check to make sure `context.sourceCode.getScope(node)` works the same way as `context.getScope()`.
          const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.sourceCode.getScope(node);

          if (
            args &&
            args.length > 0 &&
            args[0].type !== 'SpreadElement' &&
            !isStaticExpression({
              node: args[0],
              scope,
            })
          ) {
            return context.report({ node: node, message: 'Found non-literal argument in require' });
          }
        }
      },
    };
  },
} as const satisfies RuleModule;
