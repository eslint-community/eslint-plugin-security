/**
 * Tries to detect instances of child_process
 * @author Adam Baldwin
 */

'use strict';

const { getImportAccessPath } = require('../utils/import-utils');
const { isStaticExpression } = require('../utils/is-static-expression');
const childProcessPackageNames = ['child_process', 'node:child_process'];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects instances of "child_process" & non-literal "exec()" calls.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-child-process.md',
    },
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        if (node.callee.name === 'require') {
          const args = node.arguments[0];
          if (
            args &&
            args.type === 'Literal' &&
            childProcessPackageNames.includes(args.value) &&
            node.parent.type !== 'VariableDeclarator' &&
            node.parent.type !== 'AssignmentExpression' &&
            node.parent.type !== 'MemberExpression'
          ) {
            context.report({ node: node, message: 'Found require("' + args.value + '")' });
          }
          return;
        }

        // Reports non-literal `exec()` calls.
        if (
          !node.arguments.length ||
          isStaticExpression({
            node: node.arguments[0],
            scope: context.getScope(),
          })
        ) {
          return;
        }
        const pathInfo = getImportAccessPath({
          node: node.callee,
          scope: context.getScope(),
          packageNames: childProcessPackageNames,
        });
        const fnName = pathInfo && pathInfo.path.length === 1 && pathInfo.path[0];
        if (fnName !== 'exec') {
          return;
        }
        context.report({ node: node, message: 'Found child_process.exec() with non Literal first argument' });
      },
    };
  },
};
