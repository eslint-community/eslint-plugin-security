/**
 * Tries to detect calls to fs functions that take a non Literal value as the filename parameter
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var names = [];
var fsMetaData = require('./data/fsFunctionData.json');
var funcNames = Object.keys(fsMetaData);

module.exports = function(context) {

    "use strict";

    var getSource = function (token) {
        return token.loc.start.line+ ':  ' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t');
    }

    return {
        "MemberExpression": function (node) {
            var result = [];
            if (funcNames.indexOf(node.property.name) !== -1) {
                var meta = fsMetaData[node.property.name];
                var args = node.parent.arguments;
                meta.forEach(function (i) {
                    if (args && args.length > i) {
                        if (args[i].type !== 'Literal') {
                            result.push(i);
                        }
                    }
                });
            }

            if (result.length > 0) {
                var token = context.getTokens(node)[0];
                return context.report(node, 'found fs.' + node.property.name + ' with non literal argument at index ' + result.join(',') + '\n\t' + getSource(token));
            }


            /*
            if (node.parent && node.parent.arguments && node.parent.arguments[index].value) {
                return context.report(node, 'found Buffer.' + node.property.name + ' with noAssert flag set true:\n\t' + getSource(token));

            }
            */
        }

    };

};
