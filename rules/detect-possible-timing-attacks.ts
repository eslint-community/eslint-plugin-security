/**
 * Looks for potential hotspot string comparisons
 * @author Adam Baldwin / Jon Lamendola
 */

import type { Rule } from 'eslint';
import type { BinaryExpression } from 'estree';
import type { Simplify } from '../utils/import-utils.ts';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const keywords = `((${['password', 'secret', 'api', 'apiKey', 'token', 'auth', 'pass', 'hash'].join(')|(')}))`;

const re = new RegExp(`^${keywords}$`, 'im');

const containsKeyword = (node: BinaryExpression['left' | 'right']): node is Simplify<Extract<BinaryExpression['left' | 'right'], { type: 'Identifier' }>> => {
  if (node.type === 'Identifier') {
    if (re.test(node.name)) {
      return true;
    }
  }
  return false;
};

export const detectPossibleTimingAttacksRuleName = 'detect-possible-timing-attacks' as const;

export const detectPossibleTimingAttacksRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects insecure comparisons (`==`, `!=`, `!==` and `===`), which check input sequentially.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-possible-timing-attacks.md',
    },
  },
  create(context) {
    return {
      IfStatement(node) {
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
} as const satisfies Rule.RuleModule;
