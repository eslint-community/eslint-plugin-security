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
    type: 'error',
    docs: {
      description: 'Detects if "pseudoRandomBytes()" is in use, which might not give you the randomness you need and expect.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-pseudoRandomBytes.md',
    },
  },
  create: function (context) {
    return {
      MemberExpression: function (node) {
        if (node.property.name === 'pseudoRandomBytes') {
          return context.report({ node: node, message: 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers' });
        }
      },
    };
  },
};
