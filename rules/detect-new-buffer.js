'use strict';

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detect instances of new Buffer(argument) where argument is any non-literal value.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/nodesecurity/eslint-plugin-security/blob/main/README.md'
    }
  },
  create: function (context) {
    return {
      NewExpression: function (node) {
        if (node.callee.name === 'Buffer' && node.arguments[0] && node.arguments[0].type !== 'Literal') {
          return context.report(node, 'Found new Buffer');
        }
      }
    };
  }
};
