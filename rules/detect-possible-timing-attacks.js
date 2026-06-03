/**
 * Looks for potential hotspot string comparisons
 * @author Adam Baldwin / Jon Lamendola
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const keywords = `((${['password', 'secret', 'api', 'apiKey', 'token', 'auth', 'pass', 'hash'].join(')|(')}))`;

const re = new RegExp(`^${keywords}$`, 'im');

const getIdentifierIfMatchesKeyword = (node) => {
  if (node.type === 'Identifier' && re.test(node.name)) {
    return node.name;
  }
  return null;
};

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects insecure comparisons (`==`, `!=`, `!==` and `===`), which check input sequentially.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-possible-timing-attacks.md',
    },
  },
  create(context) {
    return {
      IfStatement: function (node) {
        if (node.test && node.test.type === 'BinaryExpression') {
          if (node.test.operator === '==' || node.test.operator === '===' || node.test.operator === '!=' || node.test.operator === '!==') {
            const left = getIdentifierIfMatchesKeyword(node.test.left);
            if (left !== null) {
              return context.report({ node, message: `Potential timing attack, left side: ${left}` });
            }

            const right = getIdentifierIfMatchesKeyword(node.test.right);
            if (right !== null) {
              return context.report({ node, message: `Potential timing attack, right side: ${right}` });
            }
          }
        }
      },
    };
  },
};
