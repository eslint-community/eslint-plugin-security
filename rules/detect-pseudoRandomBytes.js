/**
 * Tries to detect crypto.pseudoRandomBytes cause it's not cryptographical strong
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var getSource = function (token) {
        return token.loc.start.line+ ':  ' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t');
    }

    return {
        "MemberExpression": function (node) {
            if (node.property.name === 'pseudoRandomBytes') {
                var token = context.getTokens(node)[0];
                return context.report(node, 'found crypto.pseudoRandomBytes which does not produce cryptographically strong numbers:\n\t' + getSource(token));
            }
        }

    };

};
