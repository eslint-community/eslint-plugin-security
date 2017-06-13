/**
 * Tries to detect calls to fs functions that take a non Literal value as the filename parameter
 * @author Adam Baldwin
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var FsMetaData = require('./data/fsFunctionData.json');
var funcNames = Object.keys(FsMetaData);

module.exports = function(context) {
  return {
    MemberExpression: function(node) {
      var result = [];
      if (funcNames.indexOf(node.property.name) !== -1) {
        var meta = FsMetaData[node.property.name];
        var args = node.parent.arguments;
        meta.forEach(function(i) {
          if (args && args.length > i) {
            if (args[i].type !== 'Literal') {
              result.push(i);
            }
          }
        });
      }

      if (result.length > 0) {
        return context.report(
          node,
          'Found fs.' +
            node.property.name +
            ' with non literal argument at index ' +
            result.join(',')
        );
      }

      /*
      if (node.parent && node.parent.arguments && node.parent.arguments[index].value) {
        return context.report(node, 'found Buffer.' + node.property.name + ' with noAssert flag set true');
      }
      */
    }
  };
};
