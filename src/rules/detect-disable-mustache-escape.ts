import type { RuleModule } from '../utils/typeHelpers.ts';

export const detectDisableMustacheEscapeRuleName = 'detect-disable-mustache-escape' as const;

export const detectDisableMustacheEscapeRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects "object.escapeMarkup = false", which can be used with some template engines to disable escaping of HTML entities.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-disable-mustache-escape.md',
    },
  },
  create(context) {
    return {
      AssignmentExpression(node) {
        if (node.operator === '=') {
          if ('property' in node.left && node.left.property) {
            if ('name' in node.left.property && node.left.property.name === 'escapeMarkup') {
              if ('value' in node.right && node.right.value === false) {
                context.report({ node, message: 'Markup escaping disabled.' });
              }
            }
          }
        }
      },
    };
  },
} as const satisfies RuleModule;
