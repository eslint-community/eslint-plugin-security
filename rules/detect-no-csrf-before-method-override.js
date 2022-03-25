/**
 * Check and see if CSRF middleware is before methodOverride
 * @author Adam Baldwin
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


module.exports = function(context) {

  let csrf = false;

  return {
    'CallExpression': function(node) {
      const token = context.getTokens(node)[0];
      const nodeType = token.type;
      const nodeValue = token.value;

      if (nodeValue === 'express') {
        if (!node.callee || !node.callee.property) {
          return;
        }

        if (node.callee.property.name === 'methodOverride' && csrf) {
          context.report(node, 'express.csrf() middleware found before express.methodOverride()');
        }
        if (node.callee.property.name === 'csrf') {
          // Keep track of found CSRF
          csrf = true;
        }
      }
    }
  };

};
