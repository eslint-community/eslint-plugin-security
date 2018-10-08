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

const containsKeywordHandlers = {
    'CallExpression': containsKeywordCallExpression,
    'Identifier': containsKeywordIdentifier,
    'MemberExpression': containsKeywordMemberExpression,
    // Not exhaustive, but covers most cases. Does not cover ConditionalExpressions, for example
}

function containsKeyword (node) {
    if (node && node.type && containsKeywordHandlers.hasOwnProperty(node.type)) {
        return containsKeywordHandlers[node.type](node);
    }
}

function containsKeywordCallExpression (node) {
    return containsKeyword(node.callee);
}

function containsKeywordIdentifier (node) {
    return re.test(node.name);
}

function containsKeywordMemberExpression (node) {
    if (node.property.type === 'Literal') {
        // Only care about literals in member expressions
        return containsKeyword(node.object) || re.test(node.property.value);
    } else {
        return containsKeyword(node.object) || containsKeyword(node.property);
    }
}

const isVulnHandlers = {
    'CallExpression': isVulnCallExpression,
    'Identifier': isVulnIdentifier,
    'Literal': isVulnLiteral,
    'MemberExpression': isVulnMemberExpression,
    // Not exhaustive, but covers most cases. Does not cover ConditionalExpressions, for example
}

function isVulnerableType (node) {
    return node && node.type && isVulnHandlers.hasOwnProperty(node.type) && isVulnHandlers[node.type](node);
}

function isVulnCallExpression (node) {
    return isVulnerableType(node.callee);
}

function isVulnIdentifier (node) {
    return true;
}

function isVulnLiteral (node) {
    // String is the only Literal that can have a secret in it
    return typeof node.value === 'string';
}

function isVulnMemberExpression (node) {
    // If anything along the path is prohibited, it could be problematic
    // ex: password.toString() could be one, so could user.password
    return isVulnerableType(node.object) || isVulnerableType(node.property);
}

module.exports = function(context) {

    "use strict";

    return {
        "BinaryExpression": function(node) {
            if (node.operator === '==' || node.operator === '===' || node.operator === '!=' || node.operator === '!==') {

                if (isVulnerableType(node.left) && isVulnerableType(node.right)) {
                    if (containsKeyword(node.left)) {
                        return context.report(node, "Potential timing attack, left side: true");
                    } else if (containsKeyword(node.right)) {
                        return context.report(node, "Potential timing attack, right side: true");
                    }
                }
            }
        }
    };

};
