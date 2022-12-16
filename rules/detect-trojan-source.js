/**
 * Detect trojan source attacks that employ unicode bidi attacks to inject malicious code
 * @author Liran Tal
 */

'use strict';

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { hasTrojanSource } = require('anti-trojan-source');

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
      onCodePathStart: function (codePath, node) {
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
