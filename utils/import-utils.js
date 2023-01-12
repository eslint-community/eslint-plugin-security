const { findVariable } = require('./find-variable');

module.exports.getImportAccessPath = getImportAccessPath;

/**
 * @typedef {Object} ImportAccessPathInfo
 * @property {string[]} path
 * @property {boolean} [defaultImport]
 * @property {string} packageName
 * @property {import("estree").SimpleCallExpression | import("estree").ImportDeclaration} node
 */
/**
 * Returns the access path information from a require or import
 *
 * @param {Object} params
 * @param {import("estree").Expression} params.node The node to check.
 * @param {import("eslint").Scope.Scope} params.scope The scope of the given node.
 * @param {string[]} params.packageNames The interesting packages the method is imported from
 * @returns {ImportAccessPathInfo | null}
 */
function getImportAccessPath({ node, scope, packageNames }) {
  const tracked = new Set();
  return getImportAccessPathInternal(node);

  /**
   * @param {import("estree").Expression} node
   * @returns {ImportAccessPathInfo | null}
   */
  function getImportAccessPathInternal(node) {
    if (tracked.has(node)) {
      // Guard infinite loops.
      return null;
    }
    tracked.add(node);

    if (node.type === 'Identifier') {
      // Track variables.
      const variable = findVariable(scope, node.name);
      if (!variable) {
        return null;
      }
      // Check variables defined in `var foo = ...`.
      const declDef = variable.defs.find(
        /** @returns {def is import("eslint").Scope.Definition & {type: 'Variable'}} */
        (def) => def.type === 'Variable' && def.node.type === 'VariableDeclarator' && def.node.init
      );
      if (declDef) {
        let propName = null;
        if (declDef.node.id.type === 'ObjectPattern') {
          const property = declDef.node.id.properties.find((property) => property.type === 'Property' && property.value.type === 'Identifier' && property.value.name === node.name);
          if (property && !property.computed) {
            propName = property.key.name;
          }
        } else if (declDef.node.id.type !== 'Identifier') {
          // Unknown access path
          return null;
        }
        const nesting = getImportAccessPathInternal(declDef.node.init);
        if (!nesting) {
          return null;
        }
        /**
         * Detects:
         * | var something = require('package-name');
         * | something(c);
         * , or
         * | var { propName: something } = require('package-name');
         * | something(c);
         */
        return {
          path: propName ? [...nesting.path, propName] : nesting.path,
          defaultImport: nesting.defaultImport,
          packageName: nesting.packageName,
          node: nesting.node,
        };
      }
      // Check variables defined in `import foo from ...`.
      const importDef = variable.defs.find(
        /** @returns {def is import("eslint").Scope.Definition & {type: 'ImportBinding'}} */
        (def) =>
          def.type === 'ImportBinding' &&
          (def.node.type === 'ImportDefaultSpecifier' || def.node.type === 'ImportNamespaceSpecifier' || def.node.type === 'ImportSpecifier') &&
          isImportDeclaration(def.node.parent)
      );
      if (importDef) {
        let propName = null;
        let defaultImport;
        if (importDef.node.type === 'ImportSpecifier') {
          propName = importDef.node.imported.name;
        } else if (importDef.node.type === 'ImportDefaultSpecifier') {
          defaultImport = true;
        } else if (importDef.node.type !== 'ImportNamespaceSpecifier') {
          // Unknown access path
          return null;
        }
        /**
         * Detects:
         * | import { propName as something } from 'package-name';
         * | something(c);
         * ,
         * | import * as something from 'package-name';
         * | something(c);
         * , or
         * | import something from 'package-name';
         * | something(c);
         */
        return {
          path: propName ? [propName] : [],
          defaultImport: defaultImport,
          packageName: importDef.node.parent.source.value,
          node: importDef.node.parent,
        };
      }
      return null;
    } else if (node.type === 'MemberExpression') {
      if (node.computed) {
        return null;
      }
      const nesting = getImportAccessPathInternal(node.object);
      if (!nesting) {
        return null;
      }
      /**
       * Detects:
       * | var something = require('package-name');
       * | something.propName(c);
       * ,
       * | var { something } = require('package-name');
       * | something.propName(c);
       * ,
       * | import something from 'package-name';
       * | something.propName(c);
       * ,
       * | import * as something from 'package-name';
       * | something.propName(c);
       * , or
       * | import { something } from 'package-name';
       * | something.propName(c);
       */
      return {
        path: [...nesting.path, node.property.name],
        defaultImport: nesting.defaultImport,
        packageName: nesting.packageName,
        node: nesting.node,
      };
    } else if (isRequireBasedImport(node)) {
      /**
       * Detects:
       * | require('package-name');
       * ,
       * | require('package-name').propName(c);
       * , or
       * | require('package-name')(c);
       */
      return {
        path: [],
        packageName: node.arguments[0].value,
        node,
      };
    }
    return null;
  }

  /**
   * Checks whether the given expression node is a require based import, or not
   * @param {import("estree").Expression} expression
   */
  function isRequireBasedImport(expression) {
    return (
      expression &&
      expression.type === 'CallExpression' &&
      expression.callee.name === 'require' &&
      expression.arguments.length &&
      expression.arguments[0].type === 'Literal' &&
      packageNames.includes(expression.arguments[0].value)
    );
  }

  /**
   * Checks whether the given node is a import, or not
   * @param {import("estree").Node} node
   */
  function isImportDeclaration(node) {
    return node && node.type === 'ImportDeclaration' && packageNames.includes(node.source.value);
  }
}
