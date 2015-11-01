/**
 * Tries to detect instances of child_process
 * @author Adam Baldwin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var names = [];

module.exports = function(context) {

    "use strict";

    var getSource = function (token) {
        return token.loc.start.line+ ':  ' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t');
    }

    return {
        "CallExpression": function (node) {
            var token = context.getTokens(node)[0];
            if (node.callee.name === 'require') {
                var args = node.arguments[0];
                if (args && args.type === 'Literal' && args.value === 'child_process') {
                    if (node.parent.type === 'VariableDeclarator') {
                        names.push(node.parent.id.name);
                    } else if (node.parent.type === 'AssignmentExpression' && node.parent.operator === '=') {
                        names.push(node.parent.left.name);
                    }
                    return context.report(node, 'found require("child_process")\n\t' + getSource(token));
                }
            }
        },
        "MemberExpression": function (node) {
            var token = context.getTokens(node)[0];
            if (node.property.name === 'exec' && names.indexOf(node.object.name) > -1) {
                if (node.parent && node.parent.arguments  && node.parent.arguments[0].type !== 'Literal') {
                    return context.report(node, 'found child_process.exec() with non Literal first argument\n\t' + getSource(token));
                }
            }
        }

    };

};
