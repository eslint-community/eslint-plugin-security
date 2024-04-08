/**
 * Check if the regex is evil or not using the safe-regex module
 * @author Adam Baldwin
 */

'use strict';

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const safe = require('safe-regex');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects potentially unsafe regular expressions, which may take a very long time to run, blocking the event loop.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-unsafe-regex.md',
    },
  },
  create(context) {
    return {
      Literal: function (node) {
        const token = context.getSourceCode().getTokens(node)[0];
        const nodeType = token.type;
        const nodeValue = token.value;

        if (nodeType === 'RegularExpression') {
          if (!safe(nodeValue)) {
            context.report({ node: node, message: 'Unsafe Regular Expression' });
          }
        }
      },
      NewExpression: function (node) {
        if (node.callee.name === 'RegExp' && node.arguments && node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
          if (!safe(node.arguments[0].value)) {
            context.report({ node: node, message: 'Unsafe Regular Expression (new RegExp)' });
          }
        }
      },
    };
  },
};
