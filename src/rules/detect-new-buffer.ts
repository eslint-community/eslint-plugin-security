import type { RuleModule } from '../utils/typeHelpers.ts';

export const detectNewBufferRuleName = 'detect-new-buffer' as const;

export const detectNewBufferRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects instances of new Buffer(argument) where argument is any non-literal value.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-new-buffer.md',
    },
  },
  create(context) {
    return {
      NewExpression(node) {
        if ('name' in node.callee && node.callee.name === 'Buffer' && node.arguments[0] && node.arguments[0].type !== 'Literal') {
          return context.report({ node, message: 'Found new Buffer' });
        }
      },
    };
  },
} as const satisfies RuleModule;
