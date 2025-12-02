/**
 * Tries to detect buffer read / write calls that use noAssert set to true
 * @author Adam Baldwin
 */

import type { BufferReadMethodKeys, BufferWriteMethodKeys, RuleModule } from '../utils/typeHelpers.ts';

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const read = [
  'readBigInt64BE',
  'readBigInt64LE',
  'readBigUint64BE',
  'readBigUInt64BE',
  'readBigUint64LE',
  'readBigUInt64LE',
  'readDoubleBE',
  'readDoubleLE',
  'readFloatBE',
  'readFloatLE',
  'readInt16BE',
  'readInt16LE',
  'readInt32BE',
  'readInt32LE',
  'readInt8',
  'readIntBE',
  'readIntLE',
  'readUint16BE',
  'readUInt16BE',
  'readUint16LE',
  'readUInt16LE',
  'readUint32BE',
  'readUInt32BE',
  'readUint32LE',
  'readUInt32LE',
  'readUint8',
  'readUInt8',
  'readUintBE',
  'readUIntBE',
  'readUintLE',
  'readUIntLE',
] as const satisfies BufferReadMethodKeys[];

const write = [
  'writeBigInt64BE',
  'writeBigInt64LE',
  'writeBigUint64BE',
  'writeBigUInt64BE',
  'writeBigUint64LE',
  'writeBigUInt64LE',
  'writeDoubleBE',
  'writeDoubleLE',
  'writeFloatBE',
  'writeFloatLE',
  'writeInt16BE',
  'writeInt16LE',
  'writeInt32BE',
  'writeInt32LE',
  'writeInt8',
  'writeIntBE',
  'writeIntLE',
  'writeUint16BE',
  'writeUInt16BE',
  'writeUint16LE',
  'writeUInt16LE',
  'writeUint32BE',
  'writeUInt32BE',
  'writeUint32LE',
  'writeUInt32LE',
  'writeUint8',
  'writeUInt8',
  'writeUintBE',
  'writeUIntBE',
  'writeUintLE',
  'writeUIntLE',
] as const satisfies BufferWriteMethodKeys[];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const detectBufferNoAssertRuleName = 'detect-buffer-noassert' as const;

export const detectBufferNoAssertRule = {
  meta: {
    type: 'problem',
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
  create(context) {
    return {
      MemberExpression(node) {
        let index: number | undefined;
        if (read.indexOf((node.property as typeof node.property & { name: BufferReadMethodKeys }).name) !== -1) {
          index = 1;
        } else if (write.indexOf((node.property as typeof node.property & { name: BufferWriteMethodKeys }).name) !== -1) {
          index = 2;
        }

        if (
          index &&
          node.parent &&
          'arguments' in node.parent &&
          node.parent.arguments &&
          node.parent.arguments[index] &&
          'value' in node.parent.arguments[index] &&
          (node.parent.arguments[index] as (typeof node.parent.arguments)[number] & { value: string }).value
        ) {
          return context.report({ node: node, message: `Found Buffer.${'name' in node.property ? node.property.name : ''} with noAssert flag set true` });
        }
      },
    };
  },
} as const satisfies RuleModule;
