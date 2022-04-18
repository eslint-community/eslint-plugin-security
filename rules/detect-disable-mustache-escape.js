'use strict';

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects "object.escapeMarkup = false", which can be used with some template engines to disable escaping of HTML entities.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/nodesecurity/eslint-plugin-security#detect-disable-mustache-escape'
    }
  },
  create: function (context) {
    return {
      AssignmentExpression: function (node) {
        if (node.operator === '=') {
          if (node.left.property) {
            if (node.left.property.name === 'escapeMarkup') {
              if (node.right.value === false) {
                context.report(node, 'Markup escaping disabled.');
              }
            }
          }
        }
      }
    };
  }
};
