/**
 * Tries to detect instances of child_process
 * @author Adam Baldwin
 */

import { getImportAccessPath } from '../utils/import-utils.ts';
import { isStaticExpression } from '../utils/is-static-expression.ts';
import type { ChildProcessModuleKeys, RuleModule } from '../utils/typeHelpers.ts';

const childProcessPackageNames = ['child_process', 'node:child_process'] as const satisfies string[];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const detectChildProcessRuleName = 'detect-child-process' as const;

export const detectChildProcessRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects instances of "child_process" & non-literal "exec()" calls.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-child-process.md',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    return {
      CallExpression(node) {
        if ('name' in node.callee && node.callee.name === 'require') {
          const args = node.arguments[0];
          if (
            args &&
            args.type === 'Literal' &&
            typeof args.value === 'string' &&
            childProcessPackageNames.includes(args.value as never) &&
            node.parent.type !== 'VariableDeclarator' &&
            node.parent.type !== 'AssignmentExpression' &&
            node.parent.type !== 'MemberExpression'
          ) {
            context.report({ node, message: 'Found require("' + args.value + '")' });
          }
          return;
        }

        const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.sourceCode.getScope(node);

        // Reports non-literal `exec()` calls.
        if (
          !node.arguments.length ||
          (node.arguments[0].type !== 'SpreadElement' &&
            isStaticExpression({
              node: node.arguments[0],
              scope,
            }))
        ) {
          return;
        }
        const pathInfo = getImportAccessPath<ChildProcessModuleKeys>({
          node: node.callee,
          scope,
          packageNames: childProcessPackageNames,
        });
        const fnName = pathInfo && pathInfo.path.length === 1 && pathInfo.path[0];
        if (fnName !== 'exec') {
          return;
        }
        context.report({ node, message: 'Found child_process.exec() with non Literal first argument' });
      },
    };
  },
} satisfies RuleModule;
