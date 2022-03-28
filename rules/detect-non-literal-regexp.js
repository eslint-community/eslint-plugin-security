/**
 * Tries to detect RegExp's created from non-literal strings.
 * @author Jon Lamendola
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects `RegExp(variable)`, which might allow an attacker to DOS your server with a long-running regular expression.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/nodesecurity/eslint-plugin-security/blob/main/docs/regular-expression-dos-and-node.md'
    }
  },
  create: function(context) {
    return {
      'NewExpression': function(node) {
        if (node.callee.name === 'RegExp') {
          const args = node.arguments;
          if (args && args.length > 0 && args[0].type !== 'Literal') {
            const token = context.getTokens(node)[0];
            return context.report(node, 'Found non-literal argument to RegExp Constructor');
          }
        }

      }
    };
  }
};
