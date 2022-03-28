'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects `object.escapeMarkup = false`, which can be used with some template engines to disable escaping of HTML entities. This can lead to Cross-Site Scripting (XSS) vulnerabilities.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)'
    }
  },
  create: function(context) {
    return {
      'AssignmentExpression': function(node) {
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
