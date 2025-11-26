import type { Scope } from 'eslint';
import type {
  Expression,
  Identifier,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  Literal,
  Node,
  SimpleCallExpression,
  Super,
  VariableDeclarator,
} from 'estree';
import { findVariable } from './find-variable.js';

export type AnyNonNullishValue = NonNullable<unknown>;

export type Simplify<BaseType> = BaseType extends BaseType
  ? AnyNonNullishValue & {
      [KeyType in keyof BaseType]: BaseType[KeyType];
    }
  : never;

type ImportAccessPathInfo = {
  path: string[];
  defaultImport?: boolean;
  packageName: string;
  node: SimpleCallExpression | ImportDeclaration;
};

/**
 * Returns the access path information from a require or import
 *
 * @param {Object} params
 * @param {import("estree").Expression} params.node The node to check.
 * @param {import("eslint").Scope.Scope} params.scope The scope of the given node.
 * @param {string[]} params.packageNames The interesting packages the method is imported from
 * @returns {ImportAccessPathInfo | null}
 */
export function getImportAccessPath({ node, scope, packageNames }: { node: Expression | Super; scope: Scope.Scope; packageNames: string[] }): ImportAccessPathInfo | null {
  const tracked = new Set<Expression | Super>();
  return getImportAccessPathInternal(node);

  /**
   * @param {import("estree").Expression} node
   * @returns {ImportAccessPathInfo | null}
   */
  function getImportAccessPathInternal(node: Expression | Super): ImportAccessPathInfo | null {
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
        (
          def
        ): def is Simplify<Extract<Scope.Definition, { type: 'Variable'; node: Omit<VariableDeclarator, 'init'> }> & { node: { init: NonNullable<VariableDeclarator['init']> } }> =>
          def.type === 'Variable' && def.node.type === 'VariableDeclarator' && !!def.node.init
      );
      if (declDef) {
        let propName: string | null = null;
        if (declDef.node.id.type === 'ObjectPattern') {
          const property = declDef.node.id.properties.find((property) => property.type === 'Property' && property.value.type === 'Identifier' && property.value.name === node.name);
          if (property && 'computed' in property && !property.computed && 'name' in property.key) {
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
        (
          def
        ): def is Simplify<
          Extract<
            Scope.Definition,
            {
              type: 'ImportBinding';
              node: ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier;
              parent: ImportDeclaration;
            }
          > & {
            parent: {
              source: {
                value: string;
              };
            };
          }
        > =>
          def.type === 'ImportBinding' &&
          (def.node.type === 'ImportDefaultSpecifier' || def.node.type === 'ImportNamespaceSpecifier' || def.node.type === 'ImportSpecifier') &&
          // TODO: Is this supposed to be `def.parent` instead?
          isImportDeclaration((def.node as unknown as typeof def).parent)
      );
      if (importDef) {
        let propName: string | null = null;
        let defaultImport: boolean | undefined;
        if (importDef.node.type === 'ImportSpecifier' && 'name' in importDef.node.imported) {
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
          // TODO: Is this supposed to be `importDef.parent` instead?
          packageName: (importDef.node as unknown as typeof importDef).parent.source.value,
          node: (importDef.node as unknown as typeof importDef).parent,
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
        path: [...nesting.path, ...('name' in node.property ? [node.property.name] : [])],
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
  function isRequireBasedImport(expression: Expression | Super): expression is Simplify<
    SimpleCallExpression & {
      callee: Identifier & {
        name: 'require';
      };
      arguments: [Simplify<Extract<SimpleCallExpression['arguments'][number], { type: 'Literal' }> & { value: string }>, ...SimpleCallExpression['arguments']];
    }
  > {
    return (
      expression &&
      expression.type === 'CallExpression' &&
      expression.callee.type === 'Identifier' &&
      expression.callee.name === 'require' &&
      !!expression.arguments.length &&
      expression.arguments[0].type === 'Literal' &&
      typeof expression.arguments[0].value === 'string' &&
      packageNames.includes(expression.arguments[0].value)
    );
  }

  /**
   * Checks whether the given node is a import, or not
   * @param {import("estree").Node} node
   */
  function isImportDeclaration(node: Node | null): node is Simplify<
    ImportDeclaration & {
      source: Extract<Literal, { value: string }>;
    }
  > {
    return !!node && node.type === 'ImportDeclaration' && typeof node.source.value === 'string' && packageNames.includes(node.source.value);
  }
}
