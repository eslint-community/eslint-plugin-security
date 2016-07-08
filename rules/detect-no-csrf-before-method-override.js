/**
 * Check and see if CSRF middleware is before methodOverride
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


module.exports = function(context) {

    "use strict";
    var csrf = false;

    return {
        "CallExpression": function(node) {
            var token = context.getTokens(node)[0],
                nodeType = token.type,
                nodeValue = token.value;

            if (nodeValue === "express") {
                if (!node.callee || !node.callee.property) {
                    return;
                }

                if (node.callee.property.name === "methodOverride" && csrf) {
                    context.report(node, "express.csrf() middleware found before express.methodOverride()");
                }
                if (node.callee.property.name === "csrf") {
                    // Keep track of found CSRF
                    csrf = true;
                }
            }
        }
    };

};

