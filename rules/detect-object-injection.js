/**
 * Tries to detect instances of var[var]
 * @author Jon Lamendola
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function getPath(value, seen, keys) {
  var index = seen.indexOf(value);
  var path = [keys[index]];
  for (index--; index >= 0; index--) {
    if (seen[index][path[0]] === value) {
      value = seen[index];
      path.unshift(keys[index]);
    }
  }
  return '~' + path.join('.');
}

function getSerialize(fn, decycle) {
  var seen = [];
  var keys = [];
  decycle =
    decycle ||
    function(key, value) {
      return '[Circular ' + getPath(value, seen, keys) + ']';
    };
  return function(key, value) {
    var ret = value;
    if (typeof value === 'object' && value) {
      if (seen.indexOf(value) !== -1) {
        ret = decycle(key, value);
      } else {
        seen.push(value);
        keys.push(key);
      }
    }
    if (fn) {
      ret = fn(key, ret);
    }
    return ret;
  };
}

function stringify(obj, fn, spaces, decycle) {
  return JSON.stringify(obj, getSerialize(fn, decycle), spaces);
}

stringify.getSerialize = getSerialize;

module.exports = function(context) {
  return {
    MemberExpression: function(node) {
      if (node.computed === true) {
        if (node.property.type === 'Identifier') {
          if (node.parent.type === 'VariableDeclarator') {
            context.report(node, 'Variable Assigned to Object Injection Sink');
          } else if (node.parent.type === 'CallExpression') {
            // console.log(node.parent)
            context.report(node, 'Function Call Object Injection Sink');
          } else {
            context.report(node, 'Generic Object Injection Sink');
          }
        }
      }
    }
  };
};
