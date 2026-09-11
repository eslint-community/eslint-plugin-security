/**
 * Tries to detect RegExp's created from non-literal strings.
 * @author Jon Lamendola
 */

'use strict';

const { isStaticExpression } = require('../utils/is-static-expression');
const { findVariable } = require('../utils/find-variable');

/**
 * Checks whether the given identifier refers to the global `RegExp` and is not shadowed.
 *
 * @param {import("estree").Node} node The identifier to check.
 * @param {import("eslint").Scope.Scope} scope The scope of the given node.
 * @returns {boolean} `true` if the identifier is the global `RegExp`.
 */
function isGlobalRegExp(node, scope) {
  if (node.type !== 'Identifier' || node.name !== 'RegExp') {
    return false;
  }
  const variable = findVariable(scope, node.name);
  return !variable || variable.defs.length === 0;
}

/**
 * Checks whether the given node is a call of the global `RegExp.escape()`.
 *
 * @param {import("estree").Node} node The node to check.
 * @param {import("eslint").Scope.Scope} scope The scope of the given node.
 * @returns {boolean} `true` if the node is a `RegExp.escape()` call.
 */
function isRegExpEscapeCall(node, scope) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'escape' &&
    isGlobalRegExp(node.callee.object, scope)
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
  if (isRegExpEscapeCall(node, scope) || isStaticExpression({ node, scope })) {
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
              // A spread can carry the constructor flags as well, wrapping it would drop them.
              const canSuggest = unescaped.every((part) => part.type !== 'SpreadElement');

              return context.report({
                node: node,
                message: 'Found non-literal argument to RegExp Constructor',
                suggest: canSuggest
                  ? [
                      {
                        desc: 'Escape the dynamic parts with RegExp.escape()',
                        fix(fixer) {
                          return unescaped.map((part) => {
                            const text = sourceCode.getText(part);
                            // A sequence expression loses its grouping when the parentheses are dropped.
                            const argument = part.type === 'SequenceExpression' ? `(${text})` : text;
                            return fixer.replaceText(part, `RegExp.escape(${argument})`);
                          });
                        },
                      },
                    ]
                  : [],
              });
            }
          }
        }
      },
    };
  },
};
