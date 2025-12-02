/**
 * Check and see if CSRF middleware is before methodOverride
 * @author Adam Baldwin
 */

import type { RuleModule } from '../utils/typeHelpers.ts';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const detectNoCsrfBeforeMethodOverrideRuleName = 'detect-no-csrf-before-method-override' as const;

export const detectNoCsrfBeforeMethodOverrideRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects Express "csrf" middleware setup before "method-override" middleware.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-no-csrf-before-method-override.md',
    },
  },
  create(context) {
    let csrf = false;

    return {
      CallExpression(node) {
        const token = (context.sourceCode || context.getSourceCode()).getTokens(node)[0];
        const nodeValue = token.value;

        if (nodeValue === 'express') {
          if (!node.callee || !('property' in node.callee) || !node.callee.property) {
            return;
          }

          if ('name' in node.callee.property && node.callee.property.name === 'methodOverride' && csrf) {
            context.report({ node, message: 'express.csrf() middleware found before express.methodOverride()' });
          }
          if ('name' in node.callee.property && node.callee.property.name === 'csrf') {
            // Keep track of found CSRF
            csrf = true;
          }
        }
      },
    };
  },
} as const satisfies RuleModule;
