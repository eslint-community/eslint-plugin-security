'use strict';

module.exports = function(context) {
  return {
    AssignmentExpression: function(node) {
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
};
