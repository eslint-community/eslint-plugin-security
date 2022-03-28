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
    type: 'suggestion',
    docs: {
      description: 'Detects `eval(variable)` which can allow an attacker to run arbitrary code inside your process.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://security.stackexchange.com/questions/94017/what-are-the-security-issues-with-eval-in-javascript'
    }
  },
  create: function(context) {
    return {
      'CallExpression': function(node) {
        if (node.callee.name === 'eval' && node.arguments[0].type !== 'Literal') {
          context.report(node, `eval with argument of type ${node.arguments[0].type}`);
        }
      }
    };
  }
};
