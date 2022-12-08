/**
 * Tries to detect instances of child_process
 * @author Adam Baldwin
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detect instances of "child_process" & non-literal "exec()" calls.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/nodesecurity/eslint-plugin-security#detect-child-process',
    },
  },
  create: function (context) {
    /*
     * Stores variable identifiers pointing to child_process to check (child_process).exec()
     */
    const childProcessIdentifiers = new Set();

    /**
     * Extract identifiers assigned the expression `require("child_process")`.
     * @param {Pattern} node
     */
    function extractChildProcessIdentifiers(node) {
      if (node.type !== 'Identifier') {
        return;
      }
      const variable = context.getScope().set.get(node.name);
      if (!variable) {
        return;
      }
      for (const reference of variable.references) {
        childProcessIdentifiers.add(reference.identifier);
      }
    }

    return {
      CallExpression: function (node) {
        if (node.callee.name === 'require') {
          const args = node.arguments[0];
          if (args && args.type === 'Literal' && args.value === 'child_process') {
            if (node.parent.type === 'VariableDeclarator') {
              extractChildProcessIdentifiers(node.parent.id);
            } else if (node.parent.type === 'AssignmentExpression' && node.parent.operator === '=') {
              extractChildProcessIdentifiers(node.parent.left);
            }
            return context.report({ node: node, message: 'Found require("child_process")' });
          }
        }
      },
      MemberExpression: function (node) {
        if (node.property.name === 'exec' && childProcessIdentifiers.has(node.object)) {
          if (node.parent && node.parent.arguments && node.parent.arguments.length && node.parent.arguments[0].type !== 'Literal') {
            return context.report({ node: node, message: 'Found child_process.exec() with non Literal first argument' });
          }
        }
      },
    };
  },
};
