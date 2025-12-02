/**
 * Tries to detect RegExp's created from non-literal strings.
 * @author Jon Lamendola
 */

import { isStaticExpression } from '../utils/is-static-expression.ts';
import type { RuleModule } from '../utils/typeHelpers.ts';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const detectNonLiteralRegExpRuleName = 'detect-non-literal-regexp' as const;

export const detectNonLiteralRegExpRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects "RegExp(variable)", which might allow an attacker to DOS your server with a long-running regular expression.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-regexp.md',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      NewExpression(node) {
        if ('name' in node.callee && node.callee.name === 'RegExp') {
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
            return context.report({ node: node, message: 'Found non-literal argument to RegExp Constructor' });
          }
        }
      },
    };
  },
} as const satisfies RuleModule;
