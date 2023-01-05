/**
 * Tries to detect buffer read / write calls that use noAssert set to true
 * @author Adam Baldwin
 */

'use strict';

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const read = [
  'readUInt8',
  'readUInt16LE',
  'readUInt16BE',
  'readUInt32LE',
  'readUInt32BE',
  'readInt8',
  'readInt16LE',
  'readInt16BE',
  'readInt32LE',
  'readInt32BE',
  'readFloatLE',
  'readFloatBE',
  'readDoubleLE',
  'readDoubleBE',
];

const write = [
  'writeUInt8',
  'writeUInt16LE',
  'writeUInt16BE',
  'writeUInt32LE',
  'writeUInt32BE',
  'writeInt8',
  'writeInt16LE',
  'writeInt16BE',
  'writeInt32LE',
  'writeInt32BE',
  'writeFloatLE',
  'writeFloatBE',
  'writeDoubleLE',
  'writeDoubleBE',
];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects calls to "buffer" with "noAssert" flag set.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-buffer-noassert.md',
    },
    __methodsToCheck: {
      read,
      write,
    },
  },
  create: function (context) {
    return {
      MemberExpression: function (node) {
        let index;
        if (read.indexOf(node.property.name) !== -1) {
          index = 1;
        } else if (write.indexOf(node.property.name) !== -1) {
          index = 2;
        }

        if (index && node.parent && node.parent.arguments && node.parent.arguments[index] && node.parent.arguments[index].value) {
          return context.report({ node: node, message: `Found Buffer.${node.property.name} with noAssert flag set true` });
        }
      },
    };
  },
};
