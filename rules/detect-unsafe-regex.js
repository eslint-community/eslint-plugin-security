/**
 * Check if the regex is evil or not using the safe-regex module
 * @author Adam Baldwin
 */

'use strict';

var Safe = require('safe-regex');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    Literal: function(node) {
      var token = context.getTokens(node)[0];
      var nodeType = token.type;
      var nodeValue = token.value;

      if (nodeType === 'RegularExpression') {
        if (!Safe(nodeValue)) {
          context.report(node, 'Unsafe Regular Expression');
        }
      }
    },
    NewExpression: function(node) {
      if (
        node.callee.name === 'RegExp' &&
        node.arguments &&
        node.arguments.length > 0 &&
        node.arguments[0].type === 'Literal'
      ) {
        if (!Safe(node.arguments[0].value)) {
          context.report(node, 'Unsafe Regular Expression (new RegExp)');
        }
      }
    }
  };
};
