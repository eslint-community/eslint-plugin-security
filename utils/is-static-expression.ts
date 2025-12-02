import type { Scope } from 'eslint';
import type { Expression, Identifier, MemberExpression, MetaProperty, SimpleCallExpression, SpreadElement } from 'estree';
import type * as url from 'node:url';
import { findVariable } from './find-variable.ts';
import { getImportAccessPath } from './import-utils.ts';
import type { PathConstructionMethodNames, PathStaticMemberNames, PathType } from './typeHelpers.ts';

const PATH_PACKAGE_NAMES = ['path', 'node:path', 'path/posix', 'node:path/posix'] as const satisfies string[];
const URL_PACKAGE_NAMES = ['url', 'node:url'] as const satisfies string[];
const PATH_CONSTRUCTION_METHOD_NAMES = new Set([
  'basename',
  'dirname',
  'extname',
  'join',
  'normalize',
  'relative',
  'resolve',
  'toNamespacedPath',
] as const satisfies PathConstructionMethodNames[]);
const PATH_STATIC_MEMBER_NAMES = new Set(['delimiter', 'sep'] as const satisfies PathStaticMemberNames[]);

/**
 * @type {WeakMap<import("estree").Expression, boolean>}
 */
const cache: WeakMap<Expression, boolean> = new WeakMap<Expression, boolean>();

/**
 * Checks whether the given expression node is a static or not.
 *
 * @param {Object} params
 * @param {import("estree").Expression} params.node The node to check.
 * @param {import("eslint").Scope.Scope} params.scope The scope of the given node.
 * @returns {boolean} if true, the given expression node is a static.
 */
export function isStaticExpression({ node, scope }: { node: Expression; scope: Scope.Scope }): boolean {
  const tracked = new Set<Expression>();
  return isStatic(node);

  /**
   * @param {import("estree").Expression} node
   * @returns {boolean}
   */
  function isStatic(node: Expression | SpreadElement): boolean {
    if (node.type === 'SpreadElement') {
      return false;
    }
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
  function isStaticWithoutCache(node: Expression): boolean {
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
    if (node.type === 'BinaryExpression' && node.left.type !== 'PrivateIdentifier') {
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
  function isStaticPath(node: Expression): boolean {
    const pathInfo = getImportAccessPath<keyof PathType>({
      node: node.type === 'CallExpression' && node.callee.type !== 'Super' ? node.callee : node,
      scope,
      packageNames: PATH_PACKAGE_NAMES,
    });
    if (!pathInfo) {
      return false;
    }
    /** @type {string | undefined} */
    let name: keyof PathType | undefined;
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
      if (!PATH_CONSTRUCTION_METHOD_NAMES.has(name as PathConstructionMethodNames)) {
        return false;
      }
      return Boolean(node.arguments.length) && node.arguments.every(isStatic);
    }

    return PATH_STATIC_MEMBER_NAMES.has(name as PathStaticMemberNames);
  }

  /**
   * Checks whether the given expression is a static `url.fileURLToPath()`.
   *
   * @param {import("estree").Expression} node The node to check.
   * @returns {boolean} if true, the given expression is a static `url.fileURLToPath()`.
   */
  function isStaticFileURLToPath(node: Expression): boolean {
    if (node.type !== 'CallExpression') {
      return false;
    }
    const pathInfo = getImportAccessPath<keyof typeof url>({
      node: node.callee,
      scope,
      packageNames: URL_PACKAGE_NAMES,
    });
    if (!pathInfo || pathInfo.path.length !== 1) {
      return false;
    }
    const name = pathInfo.path[0];
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
  function isStaticImportMetaUrl(node: Expression): node is MemberExpression & {
    computed: false;
    property: Identifier & {
      name: 'url';
    };
    object: MetaProperty & {
      meta: Identifier & {
        name: 'import';
      };
      property: Identifier & {
        name: 'meta';
      };
    };
  } {
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
  function isStaticRequireResolve(node: Expression): node is SimpleCallExpression & {
    callee: MemberExpression & {
      computed: false;
      property: Identifier & {
        name: 'resolve';
      };
      object: Identifier & {
        name: 'require';
      };
    };
  } {
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
  function isStaticCwd(node: Expression): node is SimpleCallExpression & {
    callee: MemberExpression & {
      computed: false;
      property: Identifier & {
        name: 'cwd';
      };
      object: Identifier & {
        name: 'process';
      };
    };
  } {
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
