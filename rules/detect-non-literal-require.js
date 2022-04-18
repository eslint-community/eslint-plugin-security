/**
 * Tries to detect calls to require with non-literal argument
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
      description: 'Detects "require(variable)", which might allow an attacker to load and run arbitrary code, or access arbitrary files on disk. ',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/nodesecurity/eslint-plugin-security#detect-non-literal-require',
    },
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        if (node.callee.name === 'require') {
          const args = node.arguments;
          if (
            (args && args.length > 0 && args[0].type === 'TemplateLiteral' && args[0].expressions.length > 0) ||
            (args[0].type !== 'TemplateLiteral' && args[0].type !== 'Literal')
          ) {
            return context.report(node, 'Found non-literal argument in require');
          }
        }
      },
    };
  },
};
