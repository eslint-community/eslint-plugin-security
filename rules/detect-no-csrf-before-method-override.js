/**
 * Check and see if CSRF middleware is before methodOverride
 * @author Adam Baldwin
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
  var csrf = false;

  return {
    CallExpression: function(node) {
      var token = context.getTokens(node)[0];
      var nodeValue = token.value;

      if (nodeValue === 'express') {
        if (!node.callee || !node.callee.property) {
          return;
        }

        if (node.callee.property.name === 'methodOverride' && csrf) {
          context.report(
            node,
            'express.csrf() middleware found before express.methodOverride()'
          );
        }
        if (node.callee.property.name === 'csrf') {
          // Keep track of found CSRF
          csrf = true;
        }
      }
    }
  };
};
