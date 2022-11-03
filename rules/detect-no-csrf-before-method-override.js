/**
 * Check and see if CSRF middleware is before methodOverride
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
      description: 'Detects Express "csrf" middleware setup before "method-override" middleware.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/nodesecurity/eslint-plugin-security#detect-no-csrf-before-method-override',
    },
  },
  create: function (context) {
    let csrf = false;

    return {
      CallExpression: function (node) {
        const token = context.getSourceCode().getTokens(node)[0];
        const nodeValue = token.value;

        if (nodeValue === 'express') {
          if (!node.callee || !node.callee.property) {
            return;
          }

          if (node.callee.property.name === 'methodOverride' && csrf) {
            context.report({ node: node, message: 'express.csrf() middleware found before express.methodOverride()' });
          }
          if (node.callee.property.name === 'csrf') {
            // Keep track of found CSRF
            csrf = true;
          }
        }
      },
    };
  },
};
