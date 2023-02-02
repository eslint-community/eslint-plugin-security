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
  create: function (context) {
    return {
      NewExpression: function (node) {
        if (node.callee.name === 'RegExp') {
          const args = node.arguments;
          if (
            args &&
            args.length > 0 &&
            !isStaticExpression({
              node: args[0],
              scope: context.getScope(),
            })
          ) {
            return context.report({ node: node, message: 'Found non-literal argument to RegExp Constructor' });
          }
        }
      },
    };
  },
};
