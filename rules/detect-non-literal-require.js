/**
 * Tries to detect calls to require with non-literal argument
 * @author Adam Baldwin
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  return {
    'CallExpression': function (node) {
      if (node.callee.name === 'require') {
        const args = node.arguments;
        if (args && args.length > 0 &&
          (args[0].type === 'TemplateLiteral' && args[0].expressions.length > 0) ||
          (args[0].type !== 'TemplateLiteral' && args[0].type !== 'Literal')) {
          const token = context.getTokens(node)[0];
          return context.report(node, 'Found non-literal argument in require');
        }
      }

    }

  };

};
