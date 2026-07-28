/**
 * Tries to detect RegExp's created from non-literal strings.
 * @author Jon Lamendola
 */

'use strict';

const { isStaticExpression } = require('../utils/is-static-expression');

/**
 * Checks whether the given node is a `RegExp.escape()` call.
 *
 * @param {import("estree").Node} node The node to check.
 * @returns {boolean} `true` if the node is a `RegExp.escape()` call.
 */
function isRegExpEscapeCall(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'RegExp' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'escape'
  );
}

/**
 * Collects the dynamic parts of an expression that are not escaped with `RegExp.escape()`.
 * Static parts are ignored, they are handled by `isStaticExpression()`.
 *
 * @param {Object} params
 * @param {import("estree").Expression} params.node The node to check.
 * @param {import("eslint").Scope.Scope} params.scope The scope of the given node.
 * @returns {import("estree").Expression[]} the unescaped dynamic parts.
 */
function getUnescapedParts({ node, scope }) {
  if (isRegExpEscapeCall(node) || isStaticExpression({ node, scope })) {
    return [];
  }
  if (node.type === 'TemplateLiteral') {
    return node.expressions.flatMap((expression) => getUnescapedParts({ node: expression, scope }));
  }
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    return [...getUnescapedParts({ node: node.left, scope }), ...getUnescapedParts({ node: node.right, scope })];
  }
  return [node];
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects "RegExp(variable)", which might allow an attacker to DOS your server with a long-running regular expression.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-regexp.md',
    },
    hasSuggestions: true,
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      NewExpression(node) {
        if (node.callee.name === 'RegExp') {
          const args = node.arguments;
          const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

          if (args && args.length > 0) {
            const unescaped = getUnescapedParts({ node: args[0], scope });

            if (unescaped.length > 0) {
              return context.report({
                node: node,
                message: 'Found non-literal argument to RegExp Constructor',
                suggest: [
                  {
                    desc: 'Escape the dynamic parts with RegExp.escape()',
                    fix(fixer) {
                      return unescaped.map((part) => fixer.replaceText(part, `RegExp.escape(${sourceCode.getText(part)})`));
                    },
                  },
                ],
              });
            }
          }
        }
      },
    };
  },
};
