/**
 * Detect trojan source attacks that employ unicode bidi attacks to inject malicious code
 * @author Liran Tal
 */

'use strict';

const dangerousBidiChars = ['\u061C', '\u200E', '\u200F', '\u202A', '\u202B', '\u202C', '\u202D', '\u202E', '\u2066', '\u2067', '\u2068', '\u2069'];

function hasTrojanSource({ sourceText }) {
  const sourceTextToSearch = sourceText.toString();

  for (const bidiChar of dangerousBidiChars) {
    if (sourceTextToSearch.includes(bidiChar)) {
      return true;
    }
  }

  return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects trojan source attacks that employ unicode bidi attacks to inject malicious code.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-trojan-source.md',
    },
  },
  create: function (context) {
    return {
      Program: function (node) {
        // at the start of analyzing a code path
        if (node.tokens && Array.isArray(node.tokens)) {
          node.tokens.forEach((tokenObject) => {
            if (tokenObject.value && hasTrojanSource({ sourceText: tokenObject.value })) {
              context.report({
                node: node,
                data: {
                  text: tokenObject.value.toString('utf-8'),
                },
                message: "Detected potential trojan source attack with unicode bidi introduced in this code: '{{text}}'.",
              });
            }
          });
        }

        if (node.comments && Array.isArray(node.comments)) {
          node.comments.forEach((tokenObject) => {
            if (tokenObject.value && hasTrojanSource({ sourceText: tokenObject.value })) {
              context.report({
                node: node,
                data: {
                  text: tokenObject.value.toString('utf-8'),
                },
                message: "Detected potential trojan source attack with unicode bidi introduced in this comment: '{{text}}'.",
              });
            }
          });
        }
      },
    };
  },
};
