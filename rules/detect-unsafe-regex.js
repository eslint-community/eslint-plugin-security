var safe = require('safe-regex');
/**
 * Check if the regex is evil or not using the safe-regex module
 * @author Adam Baldwin 
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";
    var getSource = function(token) {
            return token.loc.start.line + ':  ' + context.getSourceLines().slice(token.loc.start.line - 1, token.loc.end.line).join('\n\t');
    }

    return {
        "Literal": function(node) {
            var token = context.getTokens(node)[0],
                nodeType = token.type,
                nodeValue = token.value;

            if (nodeType === "RegularExpression") {
                if (!safe(nodeValue)) {
                    context.report(node, "Unsafe Regular Expression\n" + getSource(token));
                }
            }
        }
    };

};

