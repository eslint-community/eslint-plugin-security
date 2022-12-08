/**
 * Identifies eval with expression
 * @author Adam Baldwin
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects "eval(variable)" which can allow an attacker to run arbitrary code inside your process.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-eval-with-expression.md',
    },
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        if (node.callee.name === 'eval' && node.arguments[0].type !== 'Literal') {
          context.report({ node: node, message: `eval with argument of type ${node.arguments[0].type}` });
        }
      },
    };
  },
};
