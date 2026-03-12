import { findVariable } from './find-variable.ts';
import { getImportAccessPath } from './import-utils.ts';
import type {
  DistributedOmit,
  Expression,
  Identifier,
  MemberExpression,
  MetaProperty,
  PathConstructionMethodNames,
  PathModuleKeys,
  PathStaticMemberNames,
  Scope,
  SimpleCallExpression,
  Simplify,
  SpreadElement,
  UrlKeys,
} from './typeHelpers.ts';

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

const cache: WeakMap<Expression, boolean> = new WeakMap<Expression, boolean>();

type IsStaticExpressionOptions = {
  /**
   * The node to check.
   */
  node: Expression;

  /**
   * The scope of the given node.
   */
  scope: Scope;
};

/**
 * Checks whether the given expression node is a static or not.
 *
 * @param options - Options
 * @returns `true` if the given expression node is static.
 */
export function isStaticExpression({ node, scope }: IsStaticExpressionOptions): boolean {
  const tracked = new Set<Expression>();
  return isStatic(node);

  /**
   * @param node - The node to check.
   * @returns `true` if the given expression node is static.
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
   * @param node - The node to check.
   * @returns `true` if the given expression node is static.
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
   * @param node - The node to check.
   * @returns `true` if the given expression is a static path construction.
   */
  function isStaticPath(node: Expression): boolean {
    const pathInfo = getImportAccessPath<PathModuleKeys>({
      node: node.type === 'CallExpression' && node.callee.type !== 'Super' ? node.callee : node,
      scope,
      packageNames: PATH_PACKAGE_NAMES,
    });
    if (!pathInfo) {
      return false;
    }
    let name: PathModuleKeys | undefined;
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
   * @param node - The node to check.
   * @returns `true` if the given expression is a static `url.fileURLToPath()`.
   */
  function isStaticFileURLToPath(node: Expression): boolean {
    if (node.type !== 'CallExpression') {
      return false;
    }
    const pathInfo = getImportAccessPath<UrlKeys>({
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
   * @param node - The node to check.
   * @returns `true` if the given expression is an `import.meta.url`.
   */
  function isStaticImportMetaUrl(node: Expression): node is Simplify<
    DistributedOmit<MemberExpression, 'computed' | 'property' | 'object'> & {
      computed: false;
      property: DistributedOmit<Identifier, 'name'> & {
        name: 'url';
      };
      object: DistributedOmit<MetaProperty, 'meta' | 'property'> & {
        meta: DistributedOmit<Identifier, 'name'> & {
          name: 'import';
        };
        property: DistributedOmit<Identifier, 'name'> & {
          name: 'meta';
        };
      };
    }
  > {
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
   * @param node - The node to check.
   * @returns `true` if the given expression is a static `require.resolve()`.
   */
  function isStaticRequireResolve(node: Expression): node is Simplify<
    DistributedOmit<SimpleCallExpression, 'callee'> & {
      callee: DistributedOmit<MemberExpression, 'computed' | 'property' | 'object'> & {
        computed: false;
        property: DistributedOmit<Identifier, 'name'> & {
          name: 'resolve';
        };
        object: DistributedOmit<Identifier, 'name'> & {
          name: 'require';
        };
      };
    }
  > {
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
   * Checks whether the given expression is a static
   * {@linkcode process.cwd | process.cwd()}.
   *
   * @param node The node to check.
   * @returns `true` if the given expression is a static {@linkcode process.cwd | process.cwd()}.
   */
  function isStaticCwd(node: Expression): node is Simplify<
    DistributedOmit<SimpleCallExpression, 'callee'> & {
      callee: DistributedOmit<MemberExpression, 'computed' | 'property' | 'object'> & {
        computed: false;
        property: DistributedOmit<Identifier, 'name'> & {
          name: 'cwd';
        };
        object: DistributedOmit<Identifier, 'name'> & {
          name: 'process';
        };
      };
    }
  > {
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
