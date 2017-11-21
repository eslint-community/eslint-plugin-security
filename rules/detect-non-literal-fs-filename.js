/**
 * Tries to detect calls to fs functions that take a non Literal value as the filename parameter
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

//var names = [];
var fsMetaData = require('./data/fsFunctionData.json');
var funcNames = Object.keys(fsMetaData);

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

/**
 * Returns true if object the "fs" method is called on is actually named "fs".
 *
 * @param node
 * @returns {boolean}
 */
function calleeIsFs(node) {
    "use strict";

    return node.callee.object.name === 'fs';
}

module.exports = function (context) {

    "use strict";

    return {
        "MemberExpression": function (node) {
            var result = [];
            if (funcNames.indexOf(node.property.name) !== -1) {
                var meta = fsMetaData[node.property.name];
                var args = node.parent.arguments;
                meta.forEach(function (i) {
                    if (args && args.length > i) {
                        if (args[i].type !== 'Literal' &&
                            calleeIsFs(node.parent) &&
                            !isLiteralWithDirnamePrefix(args[i])
                        ) {
                            result.push(i);
                        }
                    }
                });
            }

            if (result.length > 0) {
                //var token = context.getTokens(node)[0];
                return context.report(node, 'Found fs.' + node.property.name + ' with non literal argument at index ' + result.join(','));
            }


            /*
            if (node.parent && node.parent.arguments && node.parent.arguments[index].value) {
                return context.report(node, 'found Buffer.' + node.property.name + ' with noAssert flag set true');

            }
            */
        }

    };

};
