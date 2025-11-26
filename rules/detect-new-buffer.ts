import type { Rule } from 'eslint';

export const detectNewBufferRule = {
  meta: {
    type: 'error',
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
        if (node.callee.name === 'Buffer' && node.arguments[0] && node.arguments[0].type !== 'Literal') {
          return context.report({ node: node, message: 'Found new Buffer' });
        }
      },
    };
  },
} as const satisfies Rule.RuleModule;
