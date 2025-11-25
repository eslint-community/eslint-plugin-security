/**
 * Tries to detect instances of var[var]
 * @author Jon Lamendola
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

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
  const seen = [];
  const keys = [];
  decycle =
    decycle ||
    function (key, value) {
      return `[Circular ${getPath(value, seen, keys)}]`;
    };
  return function (key, value) {
    let ret = value;
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
};

const stringify = (obj, fn, spaces, decycle) => {
  return JSON.stringify(obj, getSerialize(fn, decycle), spaces);
};

stringify.getSerialize = getSerialize;
module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects "variable[key]" as a left- or right-hand assignment operand.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-object-injection.md',
    },
  },
  create(context) {
    return {
      MemberExpression: function (node) {
        if (node.computed === true) {
          if (node.property.type === 'Identifier') {
            if (node.parent.type === 'VariableDeclarator') {
              context.report({ node: node, message: 'Variable Assigned to Object Injection Sink' });
            } else if (node.parent.type === 'CallExpression') {
              context.report({ node: node, message: 'Function Call Object Injection Sink' });
            } else {
              context.report({ node: node, message: 'Generic Object Injection Sink' });
            }
          }
        }
      },
    };
  },
};
