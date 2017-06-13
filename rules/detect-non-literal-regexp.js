/**
 * Tries to detect RegExp's created from non-literal strings.
 * @author Jon Lamendola
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


module.exports = function(context) {

        "use strict";

        return {
                "NewExpression": function(node) {
                        if (node.callee.name === 'RegExp') {
                                var args = node.arguments;
                                if (args && args.length > 0 && args[0].type !== 'Literal') {
                                        var token = context.getTokens(node)[0];
                                        return context.report(node, 'Found non-literal argument to RegExp Constructor');
                                }
                        }

                }

        }
}
