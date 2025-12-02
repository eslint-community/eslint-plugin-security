/**
 * Check if the regex is evil or not using the safe-regex module
 * @author Adam Baldwin
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import safe from 'safe-regex';
import type { RuleModule } from '../utils/typeHelpers.ts';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const detectUnsafeRegexRuleName = 'detect-unsafe-regex' as const;

export const detectUnsafeRegexRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects potentially unsafe regular expressions, which may take a very long time to run, blocking the event loop.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-unsafe-regex.md',
    },
  },
  create(context) {
    return {
      Literal(node) {
        const token = context.getSourceCode().getTokens(node)[0];
        const nodeType = token.type;
        const nodeValue = token.value;

        if (nodeType === 'RegularExpression') {
          if (!safe(nodeValue)) {
            context.report({ node: node, message: 'Unsafe Regular Expression' });
          }
        }
      },
      NewExpression(node) {
        if ('name' in node.callee && node.callee.name === 'RegExp' && node.arguments && node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
          if ((typeof node.arguments[0].value === 'string' || node.arguments[0].value instanceof RegExp) && !safe(node.arguments[0].value)) {
            context.report({ node: node, message: 'Unsafe Regular Expression (new RegExp)' });
          }
        }
      },
    };
  },
} as const satisfies RuleModule;
