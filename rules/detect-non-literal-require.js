/**
 * Tries to detect calls to require with non-literal argument
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Returns true if expression is only a literal with __dirname prefix.
 *
 * @param node
 * @returns {boolean}
 */
function isLiteralWithDirnamePrefix(node) {
    "use strict";

    if (node.type === 'BinaryExpression') {
        return node.left.type === 'Identifier' && node.left.name === '__dirname' && node.right.type === 'Literal';
    // } else if (node.type === 'TemplateLiteral') { // ES6+
    //     return node.expressions.length === 1 && node.expressions[0].name === '__dirname' &&
    //         node.expressions[0].start === node.start + 1
    }

    return false;
}

module.exports = function(context) {

    "use strict";

    return {
        "CallExpression": function (node) {
            if (node.callee.name === 'require') {
                var args = node.arguments;
                if (args && args.length > 0 && args[0].type !== 'Literal' && !isLiteralWithDirnamePrefix(args[0])) {
                    //var token = context.getTokens(node)[0];
                    return context.report(node, 'Found non-literal argument in require');
                }
            }

        }

    };

};

