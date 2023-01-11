/**
 * Tries to detect calls to fs functions that take a non Literal value as the filename parameter
 * @author Adam Baldwin
 */

'use strict';

const fsMetaData = require('../utils/data/fsFunctionData.json');
const funcNames = Object.keys(fsMetaData);
const fsPackageNames = ['fs', 'node:fs', 'fs/promises', 'node:fs/promises', 'fs-extra'];

const { getImportAccessPath } = require('../utils/import-utils');

//------------------------------------------------------------------------------
// Utils
//------------------------------------------------------------------------------

function getIndices(node, argMeta) {
  return (argMeta || []).filter((argIndex) => node.arguments[argIndex].type !== 'Literal');
}

function generateReport({ context, node, packageName, methodName, indices }) {
  if (!indices || indices.length === 0) {
    return;
  }
  context.report({ node, message: `Found ${methodName} from package "${packageName}" with non literal argument at index ${indices.join(',')}` });
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects variable in filename argument of "fs" calls, which might allow an attacker to access anything on your system.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-fs-filename.md',
    },
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        // don't check require. If all arguments are Literals, it's surely safe!
        if ((node.callee.type === 'Identifier' && node.callee.name === 'require') || node.arguments.every((argument) => argument.type === 'Literal')) {
          return;
        }

        const pathInfo = getImportAccessPath({
          node: node.callee,
          scope: context.getScope(),
          packageNames: fsPackageNames,
        });
        if (!pathInfo) {
          return;
        }
        let fnName;
        if (pathInfo.path.length === 1) {
          // Check for:
          // | var something = require('fs').readFile;
          // | something(a);
          // ,
          // | var something = require('fs');
          // | something.readFile(c);
          // ,
          // | var { readFile: something } = require('fs')
          // | readFile(filename);
          // ,
          // | import { readFile as something } from 'fs';
          // | something(filename);
          // , or
          // | import * as something from 'fs';
          // | something.readFile(c);
          fnName = pathInfo.path[0];
        } else if (pathInfo.path.length === 2) {
          // Check for:
          // | var something = require('fs').promises;
          // | something.readFile(filename)
          fnName = pathInfo.path[1];
        } else {
          return;
        }
        if (!funcNames.includes(fnName)) {
          return false;
        }
        const packageName = pathInfo.packageName;

        const indices = getIndices(node, fsMetaData[fnName]);

        generateReport({
          context,
          node,
          packageName,
          methodName: fnName,
          indices,
        });
      },
    };
  },
};
