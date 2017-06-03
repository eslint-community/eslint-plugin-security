/**
 * Tries to detect crypto.pseudoRandomBytes cause it's not cryptographical strong
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "MemberExpression": function (node) {
            if (node.property.name === 'pseudoRandomBytes') {
                var token = context.getTokens(node)[0];
                return context.report(node, 'Found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers');
            }
        }

    };

};
