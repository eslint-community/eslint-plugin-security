const { findVariable } = require('./find-variable');
const { getImportAccessPath } = require('./import-utils');

module.exports.isStaticExpression = isStaticExpression;

const PATH_PACKAGE_NAMES = ['path', 'node:path', 'path/posix', 'node:path/posix'];
const URL_PACKAGE_NAMES = ['url', 'node:url'];
const PATH_CONSTRUCTION_METHOD_NAMES = new Set(['basename', 'dirname', 'extname', 'join', 'normalize', 'relative', 'resolve', 'toNamespacedPath']);
const PATH_STATIC_MEMBER_NAMES = new Set(['delimiter', 'sep']);

/**
 * @type {WeakMap<import("estree").Expression, boolean>}
 */
const cache = new WeakMap();

/**
 * Checks whether the given expression node is a static or not.
 *
 * @param {Object} params
 * @param {import("estree").Expression} params.node The node to check.
 * @param {import("eslint").Scope.Scope} params.scope The scope of the given node.
 * @returns {boolean} if true, the given expression node is a static.
 */
function isStaticExpression({ node, scope }) {
  const tracked = new Set();
  return isStatic(node);

  /**
   * @param {import("estree").Expression} node
   * @returns {boolean}
   */
  function isStatic(node) {
    let result = cache.get(node);
    if (result == null) {
      result = isStaticWithoutCache(node);
      cache.set(node, result);
    }
    return result;
  }
  /**
   * @param {import("estree").Expression} node
   * @returns {boolean}
   */
  function isStaticWithoutCache(node) {
    if (tracked.has(node)) {
      // Guard infinite loops.
      return false;
    }
    tracked.add(node);
    if (node.type === 'Literal') {
      return true;
    }
    if (node.type === 'TemplateLiteral') {
      // A node is static if all interpolations are static.
      return node.expressions.every(isStatic);
    }
    if (node.type === 'BinaryExpression') {
      // An expression is static if both operands are static.
      return isStatic(node.left) && isStatic(node.right);
    }
    if (node.type === 'Identifier') {
      const variable = findVariable(scope, node.name);
      if (variable) {
        if (variable.defs.length === 0) {
          if (node.name === '__dirname' || node.name === '__filename') {
            // It is a global variable that can be used in CJS of Node.js.
            return true;
          }
        } else if (variable.defs.length === 1) {
          const def = variable.defs[0];
          if (
            def.type === 'Variable' &&
            // It has an initial value.
            def.node.init &&
            // It does not write new values.
            variable.references.every((ref) => ref.isReadOnly() || ref.identifier === def.name)
          ) {
            // A variable is static if its initial value is static.
            return isStatic(def.node.init);
          }
        }
      } else {
        return false;
      }
    }
    return isStaticPath(node) || isStaticFileURLToPath(node) || isStaticImportMetaUrl(node) || isStaticRequireResolve(node) || isStaticCwd(node);
  }

  /**
   * Checks whether the given expression is a static path construction.
   *
   * @param {import("estree").Expression} node The node to check.
   * @returns {boolean} if true, the given expression is a static path construction.
   */
  function isStaticPath(node) {
    const pathInfo = getImportAccessPath({
      node: node.type === 'CallExpression' ? node.callee : node,
      scope,
      packageNames: PATH_PACKAGE_NAMES,
    });
    if (!pathInfo) {
      return false;
    }
    /** @type {string | undefined} */
    let name;
    if (pathInfo.path.length === 1) {
      // e.g. import path from 'path'
      name = pathInfo.path[0];
    } else if (pathInfo.path.length === 2 && pathInfo.path[0] === 'posix') {
      // e.g. import { posix as path } from 'path'
      name = pathInfo.path[1];
    }
    if (name == null) {
      return false;
    }

    if (node.type === 'CallExpression') {
      if (!PATH_CONSTRUCTION_METHOD_NAMES.has(name)) {
        return false;
      }
      return Boolean(node.arguments.length) && node.arguments.every(isStatic);
    }

    return PATH_STATIC_MEMBER_NAMES.has(name);
  }

  /**
   * Checks whether the given expression is a static `url.fileURLToPath()`.
   *
   * @param {import("estree").Expression} node The node to check.
   * @returns {boolean} if true, the given expression is a static `url.fileURLToPath()`.
   */
  function isStaticFileURLToPath(node) {
    if (node.type !== 'CallExpression') {
      return false;
    }
    const pathInfo = getImportAccessPath({
      node: node.callee,
      scope,
      packageNames: URL_PACKAGE_NAMES,
    });
    if (!pathInfo || pathInfo.path.length !== 1) {
      return false;
    }
    let name = pathInfo.path[0];
    if (name !== 'fileURLToPath') {
      return false;
    }
    return Boolean(node.arguments.length) && node.arguments.every(isStatic);
  }

  /**
   * Checks whether the given expression is an `import.meta.url`.
   *
   * @param {import("estree").Expression} node The node to check.
   * @returns {boolean} if true, the given expression is an `import.meta.url`.
   */
  function isStaticImportMetaUrl(node) {
    return (
      node.type === 'MemberExpression' &&
      !node.computed &&
      node.property.type === 'Identifier' &&
      node.property.name === 'url' &&
      node.object.type === 'MetaProperty' &&
      node.object.meta.name === 'import' &&
      node.object.property.name === 'meta'
    );
  }

  /**
   * Checks whether the given expression is a static `require.resolve()`.
   *
   * @param {import("estree").Expression} node The node to check.
   * @returns {boolean} if true, the given expression is a static `require.resolve()`.
   */
  function isStaticRequireResolve(node) {
    if (
      node.type !== 'CallExpression' ||
      node.callee.type !== 'MemberExpression' ||
      node.callee.computed ||
      node.callee.property.type !== 'Identifier' ||
      node.callee.property.name !== 'resolve' ||
      node.callee.object.type !== 'Identifier' ||
      node.callee.object.name !== 'require'
    ) {
      return false;
    }
    const variable = findVariable(scope, node.callee.object.name);
    if (!variable || variable.defs.length !== 0) {
      return false;
    }
    return Boolean(node.arguments.length) && node.arguments.every(isStatic);
  }

  /**
   * Checks whether the given expression is a static `process.cwd()`.
   *
   * @param {import("estree").Expression} node The node to check.
   * @returns {boolean} if true, the given expression is a static `process.cwd()`.
   */
  function isStaticCwd(node) {
    if (
      node.type !== 'CallExpression' ||
      node.callee.type !== 'MemberExpression' ||
      node.callee.computed ||
      node.callee.property.type !== 'Identifier' ||
      node.callee.property.name !== 'cwd' ||
      node.callee.object.type !== 'Identifier' ||
      node.callee.object.name !== 'process'
    ) {
      return false;
    }
    const variable = findVariable(scope, node.callee.object.name);
    if (!variable || variable.defs.length !== 0) {
      return false;
    }
    return true;
  }
}
