/**
 * Tries to detect crypto.pseudoRandomBytes cause it's not cryptographical strong
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "detect crypto.pseudoRandomBytes cause it's not cryptographical strong",
            category: "Security"
        }
    },
    create(context) {

    "use strict";

        return {
            "MemberExpression": function (node) {
                if (node.property.name === 'pseudoRandomBytes') {
                    return context.report(node, 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers');
                }
            }

        };

    }
};
