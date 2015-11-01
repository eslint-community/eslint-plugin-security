/**
 * Tries to detect instances of var[var]
 * @author Jon Lamendola
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var Sinks = [];
function getSerialize (fn, decycle) {
  var seen = [], keys = [];
  decycle = decycle || function(key, value) {
    return '[Circular ' + getPath(value, seen, keys) + ']'
  };
  return function(key, value) {
    var ret = value;
    if (typeof value === 'object' && value) {
      if (seen.indexOf(value) !== -1)
        ret = decycle(key, value);
      else {
        seen.push(value);
        keys.push(key);
      }
    }
    if (fn) ret = fn(key, ret);
    return ret;
  }
}

function getPath (value, seen, keys) {
  var index = seen.indexOf(value);
  var path = [ keys[index] ];
  for (index--; index >= 0; index--) {
    if (seen[index][ path[0] ] === value) {
      value = seen[index];
      path.unshift(keys[index]);
    }
  }
  return '~' + path.join('.');
}

function stringify(obj, fn, spaces, decycle) {
  return JSON.stringify(obj, getSerialize(fn, decycle), spaces);
}

stringify.getSerialize = getSerialize;module.exports = function(context) {

        "use strict";

var isChanged = false;



        return {
            "MemberExpression": function(node) {

                if (node.computed === true) {
                    var token = context.getTokens(node)[0];
                    if (node.property.type === 'Identifier') {
                        if (node.parent.type === 'VariableDeclarator') {
   context.report(node, 'Variable Assigned to Object Injection Sink: ' + context.getFilename() + ': ' + token.loc.start.line+ '\n\t' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t') + '\n\n');
    
                        } else if (node.parent.type === 'CallExpression') {
                        //    console.log(node.parent)
  context.report(node, 'Function Call Object Injection Sink: ' + context.getFilename() + ': ' + token.loc.start.line+ '\n\t' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t') + '\n\n');
                        } else {
                        context.report(node, 'Generic Object Injection Sink: ' + context.getFilename() + ': ' + token.loc.start.line+ '\n\t' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t') + '\n\n');
    
                        }

                    }
                }

            }

        };
    }

