/**
 * Tries to detect RegExp's created from non-literal strings.
 * @author Jon Lamendola
 */

'use strict';

const { isStaticExpression } = require('../utils/is-static-expression');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
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
        if (node.callee.name === 'RegExp') {
          const args = node.arguments;
          const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

          if (
            args &&
            args.length > 0 &&
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
};
