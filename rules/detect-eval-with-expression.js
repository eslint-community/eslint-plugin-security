/**
 * Identifies eval with expression
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "identify eval with expression",
            category: "Security"
        }
    },
    create(context) {

    "use strict";

        return {
            "CallExpression": function(node) {
                if (node.callee.name === "eval" && node.arguments[0].type !== 'Literal') {
                    context.report(node, "eval with argument of type " + node.arguments[0].type);
                }
            }
        };
    }
};
