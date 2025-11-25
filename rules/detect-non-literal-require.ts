/**
 * Tries to detect calls to require with non-literal argument
 * @author Adam Baldwin
 */

'use strict';

const { isStaticExpression } = require('../utils/is-static-expression');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects "require(variable)", which might allow an attacker to load and run arbitrary code, or access arbitrary files on disk.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-require.md',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      CallExpression(node) {
        if (node.callee.name === 'require') {
          const args = node.arguments;
          const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

          if (
            args &&
            args.length > 0 &&
            !isStaticExpression({
              node: args[0],
              scope,
            })
          ) {
            return context.report({ node: node, message: 'Found non-literal argument in require' });
          }
        }
      },
    };
  },
};
