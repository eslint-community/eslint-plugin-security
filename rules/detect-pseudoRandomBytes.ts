/**
 * Tries to detect crypto.pseudoRandomBytes cause it's not cryptographical strong
 * @author Adam Baldwin
 */

import type { Rule } from 'eslint';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const detectPseudoRandomBytesRuleName = 'detect-pseudoRandomBytes' as const;

export const detectPseudoRandomBytesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects if "pseudoRandomBytes()" is in use, which might not give you the randomness you need and expect.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-pseudoRandomBytes.md',
    },
  },
  create(context) {
    return {
      MemberExpression(node) {
        if ('name' in node.property && node.property.name === 'pseudoRandomBytes') {
          return context.report({ node: node, message: 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers' });
        }
      },
    };
  },
} as const satisfies Rule.RuleModule;
