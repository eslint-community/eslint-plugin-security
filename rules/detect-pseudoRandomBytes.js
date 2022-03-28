/**
 * Tries to detect crypto.pseudoRandomBytes cause it's not cryptographical strong
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
      description: 'Detects if `pseudoRandomBytes()` is in use, which might not give you the randomness you need and expect.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://stackoverflow.com/questions/18130254/randombytes-vs-pseudorandombytes'
    }
  },
  create: function(context) {
    return {
      'MemberExpression': function(node) {
        if (node.property.name === 'pseudoRandomBytes') {
          const token = context.getTokens(node)[0];
          return context.report(node, 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers');
        }
      }
    };
  }
};
