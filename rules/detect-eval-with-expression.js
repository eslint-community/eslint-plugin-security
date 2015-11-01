/**
 * Idnetifies eval with expression
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "CallExpression": function(node) {
            if (node.callee.name === "eval" && node.arguments[0].type !== 'Literal') {
                context.report(node, "eval with argument of type " + node.arguments[0].type);
            }
        }
    };
};
