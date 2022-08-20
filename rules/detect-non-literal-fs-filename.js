/**
 * Tries to detect calls to fs functions that take a non Literal value as the filename parameter
 * @author Adam Baldwin
 */

'use strict';

const fsMetaData = require('./data/fsFunctionData.json');
const funcNames = Object.keys(fsMetaData);
const fsPackageNames = require('./data/fsPackagesNames.json');

//------------------------------------------------------------------------------
// Utils
//------------------------------------------------------------------------------

function sinkPositions(node, argMeta) {
  return (argMeta || []).filter((argIndex) => node.arguments[argIndex].type !== 'Literal');
}

function generateReport({ context, node, packageName, methodName, indeces }) {
  return context.report(node, `Found ${methodName} from package "${packageName}" with non literal argument at index ${indeces.join(',')}`);
}

/**
 * Detects:
 * | var something = require('fs').readFile;
 * | something(a);
 */
function sinksForRequireWithProperty({ context, methodName, node, program }) {
  const declaration = program.body
    // a node import is a variable declaration
    .filter((entry) => entry.type === 'VariableDeclaration')
    // one var/let/const may contain multiple declarations, separated by comma, after the "="" sign
    .flatMap((d) => d.declarations)
    // it's imported from 'fs'
    .find(
      (e) =>
        e.init.object?.callee.name === 'require' &&
        e.init.object.arguments[0].type === 'Literal' &&
        fsPackageNames.includes(e.init.object.arguments[0].value) &&
        e.init.parent.id.name === methodName
    );

  if (!declaration) {
    return null;
  }

  // we found the require for our method!
  const fsFunction = declaration.init.property.name;
  const packageName = declaration.init.object.arguments[0].value;
  const fnName = declaration.init.property.name;

  const sinks = sinkPositions(node, fsMetaData[fsFunction]);

  return generateReport({
    context,
    node,
    packageName,
    methodName: fnName,
    indeces: sinks,
  });
}

/**
 * Detects:
 * | import { readFile as something } from 'fs';
 * | something(filename);
 */
function sinkForImport({ context, methodName, node, program }) {
  const specifier = program.body
    .filter((entry) => entry.type === 'ImportDeclaration' && fsPackageNames.includes(entry.source.value) && entry.specifiers.some((s) => s.local.name === methodName))
    .flatMap((i) => i.specifiers)
    .find((s) => !!funcNames.includes(s.imported.name));

  if (!specifier) {
    return null;
  }

  const fnName = specifier.imported.name;
  const meta = fsMetaData[fnName];
  const sinks = sinkPositions(node, meta);

  return generateReport({
    context,
    node,
    packageName: specifier.parent.source.value,
    methodName: fnName,
    indeces: sinks,
  });
}

/**
 * Detects:
 * | var something = require('fs');
 * | something.readFile(c);
 */
function sinkForMethodCall({ context, node, program, methodName }) {
  const imports = program.body
    .filter((entry) => entry.type === 'VariableDeclaration')
    // one var/let/const may contain multiple declarations, separated by comma, after the "="" sign
    .flatMap((d) => d.declarations)
    // // it's imported from 'fs'
    .find((e) => e.init.callee?.name === 'require' && e.init.arguments.some((a) => fsPackageNames.includes(a.value)));

  if (!imports) {
    return null;
  }

  const sinks = sinkPositions(node.parent, fsMetaData[methodName]);
  if (sinks.length === 0) {
    return null;
  }

  const packageName = imports.init.arguments[0].value;

  return generateReport({
    context,
    node,
    packageName,
    methodName,
    indeces: sinks,
  });
}

/**
 * Detects:
 * | var { readFile } = require('fs')
 * | readFile(filename)
 */
function sinkForDestructuredRequire({ context, methodName, node, program }) {
  const declaration = program.body
    .filter((entry) => entry.type === 'VariableDeclaration')
    .flatMap((entry) => entry.declarations)
    .find((d) => d.init?.callee?.name === 'require' && fsPackageNames.includes(d.init.arguments?.[0].value));

  if (!declaration) {
    return null;
  }

  const meta = fsMetaData[methodName];
  const sinks = sinkPositions(node, meta);

  return generateReport({
    context,
    node,
    packageName: declaration.init.arguments[0].value,
    methodName,
    indeces: sinks,
  });
}

/**
 * Detects:
 * | import * as something from 'fs';
 * | something.readFile(c);
 */
function sinkForDefaultImport({ context, methodName, node, objectName, program }) {
  if (!funcNames.includes(methodName)) {
    return null;
  }

  const import_ = program.body.find(
    (entry) => entry.type === 'ImportDeclaration' && fsPackageNames.includes(entry.source.value) && entry?.specifiers.some((s) => s.local.name === objectName)
  );

  if (!import_) {
    return null;
  }

  const meta = fsMetaData[methodName];
  const sinks = sinkPositions(node.parent, meta);

  return generateReport({
    context,
    node,
    packageName: import_.source.value,
    methodName,
    indeces: sinks,
  });
}

/**
 * Detects:
 * | var something = require('fs').promises;
 * | something.readFile(filename)
 */
function sinkForPromiseProperty({ context, methodName, node, objectName, program }) {
  const declaration = program.body
    .filter((entry) => entry.type === 'VariableDeclaration')
    .flatMap((entry) => entry.declarations)
    .find(
      (d) =>
        d.id.name === objectName &&
        d.init.type === 'MemberExpression' &&
        // package name is fs / fs-extra
        fsPackageNames.includes(d.init.object.arguments[0].value)
    );

  if (!declaration) {
    return null;
  }
  const meta = fsMetaData[methodName];
  const sinks = sinkPositions(node.parent, meta);

  return generateReport({
    context,
    node,
    packageName: declaration.init.object.arguments[0].value,
    methodName,
    indeces: sinks,
  });
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
      url: 'https://github.com/nodesecurity/eslint-plugin-security#detect-non-literal-fs-filename',
    },
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        // readFile/open/... (but might be renamed)
        const localMethodName = node.callee.name;

        // don't check require. If all arguments are Literals, it's surely safe!
        if (!localMethodName || localMethodName === 'require' || node.arguments.every((argument) => argument.type === 'Literal')) {
          return;
        }

        // this only works, when imports are on top level!
        const program = context.getAncestors()[0];

        const requireReport = sinksForRequireWithProperty({
          context,
          methodName: localMethodName,
          node,
          program,
        });
        if (requireReport) {
          return requireReport;
        }

        const destructuredRequireReport = sinkForDestructuredRequire({
          context,
          methodName: localMethodName,
          node,
          program,
        });
        if (destructuredRequireReport) {
          return destructuredRequireReport;
        }

        const importReport = sinkForImport({
          context,
          methodName: localMethodName,
          node,
          program,
        });
        if (importReport) {
          return importReport;
        }
      },
      MemberExpression: function (node) {
        const realMethodName = node.property.name; // readFile/open/... (not renamed)
        const localObjectName = node.object.name; // fs/node:fs/... (but might be renamed)

        // this only works, when imports are on top level!
        const program = context.getAncestors()[0];

        const methodCallSinkReport = sinkForMethodCall({
          context,
          methodName: realMethodName,
          node,
          program,
        });
        if (methodCallSinkReport) {
          return methodCallSinkReport;
        }

        const defaultImportReport = sinkForDefaultImport({
          program,
          objectName: localObjectName,
          methodName: realMethodName,
          context,
          node,
        });

        if (defaultImportReport) {
          return defaultImportReport;
        }

        const promisePropertyReport = sinkForPromiseProperty({
          context,
          methodName: realMethodName,
          node,
          objectName: localObjectName,
          program,
        });

        if (promisePropertyReport) {
          return promisePropertyReport;
        }
      },
    };
  },
};
