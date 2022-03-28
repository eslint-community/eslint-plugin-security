/**
 * Tries to detect instances of var[var]
 * @author Jon Lamendola
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const Sinks = [];


const getPath = (value, seen, keys) => {

  let index = seen.indexOf(value);
  const path = [keys[index]];
  for (index--; index >= 0; index--) {
    if (seen[index][path[0]] === value) {
      value = seen[index];
      path.unshift(keys[index]);
    }
  }
  return `~${path.join('.')}`;
};

const getSerialize = (fn, decycle) => {

  const seen = []; const keys = [];
  decycle = decycle || function(key, value) {

    return `[Circular ${  getPath(value, seen, keys)  }]`;
  };
  return function(key, value) {

    let ret = value;
    if (typeof value === 'object' && value) {
      if (seen.indexOf(value) !== -1) {
        ret = decycle(key, value);
      }
      else {
        seen.push(value);
        keys.push(key);
      }
    }
    if (fn) {
      ret = fn(key, ret);
    }
    return ret;
  };
};


const stringify = (obj, fn, spaces, decycle) => {

  return JSON.stringify(obj, getSerialize(fn, decycle), spaces);
};

stringify.getSerialize = getSerialize; module.exports = function(context) {

  const isChanged = false;



  return {
    'MemberExpression': function(node) {

      if (node.computed === true) {
        const token = context.getTokens(node)[0];
        if (node.property.type === 'Identifier') {
          if (node.parent.type === 'VariableDeclarator') {
            context.report(node, 'Variable Assigned to Object Injection Sink');

          }
          else if (node.parent.type === 'CallExpression') {
            //    console.log(node.parent)
            context.report(node, 'Function Call Object Injection Sink');
          }
          else {
            context.report(node, 'Generic Object Injection Sink');

          }

        }
      }

    }

  };
};
