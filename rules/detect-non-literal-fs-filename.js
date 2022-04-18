/**
 * Tries to detect calls to fs functions that take a non Literal value as the filename parameter
 * @author Adam Baldwin
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const fsMetaData = require('./data/fsFunctionData.json');
const funcNames = Object.keys(fsMetaData);

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects variable in filename argument of "fs" calls, which might allow an attacker to access anything on your system.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/nodesecurity/eslint-plugin-security#detect-non-literal-fs-filename',
    },
  },
  create: function (context) {
    return {
      MemberExpression: function (node) {
        const result = [];
        if (funcNames.indexOf(node.property.name) !== -1) {
          const meta = fsMetaData[node.property.name];
          const args = node.parent.arguments;
          meta.forEach((i) => {
            if (args && args.length > i) {
              if (args[i].type !== 'Literal') {
                result.push(i);
              }
            }
          });
        }

        if (result.length > 0) {
          return context.report(node, `Found fs.${node.property.name} with non literal argument at index ${result.join(',')}`);
        }

        /*
              if (node.parent && node.parent.arguments && node.parent.arguments[index].value) {
                  return context.report(node, 'found Buffer.' + node.property.name + ' with noAssert flag set true');

              }
              */
      },
    };
  },
};
