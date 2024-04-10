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

const containsKeyword = (node) => {
  if (node.type === 'Identifier') {
    if (re.test(node.name)) {
      return true;
    }
  }
  return;
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
            if (node.test.left) {
              const left = containsKeyword(node.test.left);
              if (left) {
                return context.report({ node: node, message: `Potential timing attack, left side: ${left}` });
              }
            }

            if (node.test.right) {
              const right = containsKeyword(node.test.right);
              if (right) {
                return context.report({ node: node, message: `Potential timing attack, right side: ${right}` });
              }
            }
          }
        }
      },
    };
  },
};
