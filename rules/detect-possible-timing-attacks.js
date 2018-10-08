/**
 * Looks for potential hotspot string comparisons
 * @author Adam Baldwin / Jon Lamendola
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var keywords = '((' + [
    'password',
    'secret',
    'api',
    'apiKey',
    'token',
    'auth',
    'pass',
    'hash'
].join(')|(') + '))';

var re = new RegExp('^.*' + keywords + '.*$', 'im');

/**
 * Maps type to what to handler function
 * Returns true if it can have a timing attack, false otherwise
 */
const isVulnHandlers = {
    'CallExpression': isVulnCallExpression,
    'Identifier': isVulnIdentifier,
    'Literal': isVulnLiteral,
    'MemberExpression': isVulnMemberExpression,
    // Not exhaustive, but covers most cases. Does not cover ConditionalExpressions, for example
}

function containsKeyword (node) {
    if (node.type === 'Identifier') {
        if (re.test(node.name)) {
            return true;
        }
    }
    return
}

function isVulnerable(node) {
    return node && node.type && isVulnHandlers.hasOwnProperty(node.type) && isVulnHandlers[node.type](node);
}

function isVulnCallExpression(node) {
    return isVulnerable(node.callee);
}

function isVulnIdentifier (node) {
    return containsKeyword(node);
}

function isVulnLiteral (node) {
    // String is the only Literal that can have a secret in it
    return typeof node.value === 'string';
}

function isVulnMemberExpression (node) {
    // If anything along the path is prohibited, it could be problematic
    // ex: password.toString() could be one, so could user.password
    return isVulnerable(node.object) || isVulnerable(node.property);
}

module.exports = function(context) {

    "use strict";

    return {
        "BinaryExpression": function(node) {
            if (node.operator === '==' || node.operator === '===' || node.operator === '!=' || node.operator === '!==') {

                if (isVulnerable(node.left) && isVulnerable(node.right)) {
                    return context.report(node, "Potential timing attack");
                }
            }
        }
    };

};
