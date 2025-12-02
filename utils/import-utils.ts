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
import type * as path from 'node:path';
import { findVariable } from './find-variable.ts';

export type PathType = typeof path;

/**
 * Any function with **`unknown`** arguments.
 * You probably want this instead of {@linkcode Function}.
 *
 * @example
 * <caption>Basic usage</caption>
 *
 * ```ts
 * const fn: UnknownFunction = (...args) => args.length;
 * ```
 *
 * @internal
 */
export type UnknownFunction = (...args: unknown[]) => unknown;

/**
 * An alias for type **`{}`**. Represents any value that is not
 * **`null`** or **`undefined`**. It is mostly used for semantic purposes to
 * help distinguish between an empty object type and **`{}`**
 * as they are not the same.
 *
 * @internal
 */
export type AnyNonNullishValue = NonNullable<unknown>;

/**
 * Useful to flatten the type output to improve type hints shown in editors.
 * And also to transform an interface into a type to aide with assignability.
 *
 * @example
 * <caption>Basic usage</caption>
 *
 * ```ts
 * interface SomeInterface {
 *   foo: number;
 *   bar?: string;
 *   baz: number | undefined;
 * }
 *
 * type SomeType = {
 *   foo: number;
 *   bar?: string;
 *   baz: number | undefined;
 * };
 *
 * const literal = { foo: 123, bar: 'hello', baz: 456 };
 * const someType: SomeType = literal;
 * const someInterface: SomeInterface = literal;
 *
 * declare function fn(object: Record<string, unknown>): void;
 *
 * fn(literal); // Good: literal object type is sealed
 * fn(someType); // Good: type is sealed
 * // @ts-expect-error
 * fn(someInterface); // Error: Index signature for type 'string' is missing in type 'someInterface'. Because `interface` can be re-opened
 * fn(someInterface as Simplify<SomeInterface>); // Good: transform an `interface` into a `type`
 * ```
 *
 * @template BaseType - The type to simplify.
 *
 * @see {@link https://github.com/sindresorhus/type-fest/blob/2300245cb6f0b28ee36c2bb852ade872254073b8/source/simplify.d.ts Source}
 * @see {@link https://github.com/microsoft/TypeScript/issues/15300 | TypeScript Issue}
 * @internal
 */
export type Simplify<BaseType> = BaseType extends BaseType
  ? BaseType extends UnknownFunction
    ? BaseType
    : AnyNonNullishValue & {
        [KeyType in keyof BaseType]: BaseType[KeyType];
      }
  : never;

/**
 * Omits keys from a type, **distributing** the operation over a union.
 * TypeScript's {@linkcode Omit} does **not** distribute over unions,
 * which can lead to the erasure of unique properties from union members
 * when omitting keys. This causes the resulting type to retain only
 * properties common to all union members, making it impossible to access
 * member-specific properties after using {@linkcode Omit}.
 * In other words, using {@linkcode Omit} on a union merges its members into
 * a less specific type, breaking type narrowing and property access based
 * on discriminants. This utility solves that limitation by applying
 * {@linkcode Omit} distributively to each union member.
 *
 * @example
 * <caption>Demonstrating `Omit` vs `DistributedOmit`</caption>
 *
 * ```ts
 * type A = {
 *   discriminant: 'A';
 *   foo: string;
 *   a: number;
 * };
 *
 * type B = {
 *   discriminant: 'B';
 *   foo: string;
 *   b: string;
 * };
 *
 * type Union = A | B;
 *
 * type OmittedUnion = Omit<Union, 'foo'>;
 * // => { discriminant: 'A' | 'B' }
 *
 * const omittedUnion: OmittedUnion = createOmittedUnion();
 *
 * if (omittedUnion.discriminant === 'A') {
 *   // We would like to narrow `omittedUnion`'s type to `A` here,
 *   // but we can't because `Omit` doesn't distribute over unions.
 *
 *   omittedUnion.a;
 *   // => Error: Property 'a' does not exist on type '{ discriminant: "A" | "B" }'
 * }
 * ```
 *
 * @template ObjectType - The base object or union type to omit properties from.
 * @template KeyType - The keys of {@linkcode ObjectType} to omit.
 * @internal
 */
export type DistributedOmit<ObjectType, KeyType extends keyof ObjectType> = ObjectType extends unknown ? Omit<ObjectType, KeyType> : never;

/**
 * A stricter version of
 * {@linkcode Extract | Extract<BaseType, TypeToExtract>} that ensures
 * every member of {@linkcode TypeToExtract} can successfully extract
 * something from {@linkcode BaseType}.
 *
 * @example
 * <caption>Basic Usage</caption>
 *
 * ```ts
 * type Example = ExtractStrict<'l' | 'm' | 's' | 'xl' | 'xs', 's' | 'xs'>
 * //=> 'xs' | 's'
 * ```
 *
 * @template BaseType - The base type to extract from.
 * @template TypeToExtract - The type(s) to extract from {@linkcode BaseType}.
 * @internal
 */
export type ExtractStrict<
  BaseType,
  TypeToExtract extends [TypeToExtract] extends [TypeToExtract extends unknown ? (Extract<BaseType, TypeToExtract> extends never ? never : TypeToExtract) : never]
    ? unknown
    : BaseType,
> = Extract<BaseType, TypeToExtract>;

/**
 * A stricter version of
 * {@linkcode Exclude | Exclude<BaseType, TypesToExclude>} that ensures
 * every member of {@linkcode TypesToExclude} can successfully exclude
 * something from {@linkcode BaseType}.
 *
 * @example
 * <caption>Basic Usage</caption>
 *
 * ```ts
 * type Example = ExcludeStrict<'l' | 'm' | 's' | 'xl' | 'xs', 's' | 'xs'>
 * //=> 'm' | 'l' | 'xl'
 * ```
 *
 * @template BaseType - The base type to exclude from.
 * @template TypesToExclude - The type(s) to exclude from {@linkcode BaseType}.
 * @internal
 */
export type ExcludeStrict<
  BaseType,
  TypesToExclude extends [TypesToExclude] extends [TypesToExclude extends unknown ? ([BaseType] extends [Exclude<BaseType, TypesToExclude>] ? never : TypesToExclude) : never]
    ? unknown
    : BaseType,
> = Exclude<BaseType, TypesToExclude>;

export type PathConstructionMethodNames = {
  [Key in keyof PathType]: PathType[Key] extends ((firstArgument: string, ...args: unknown[]) => string) | ((...args: string[]) => string) ? Key : never;
}[keyof PathType];

export type PathStaticMemberNames = {
  [Key in keyof PathType]: PathType[Key] extends PropertyKey ? Key : never;
}[keyof PathType];

type ImportAccessPathInfo<T extends string = PathConstructionMethodNames> = {
  path: T[];
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
export function getImportAccessPath<T extends string = PathConstructionMethodNames>({
  node,
  scope,
  packageNames,
}: {
  node: Expression | Super;
  scope: Scope.Scope;
  packageNames: string[];
}): ImportAccessPathInfo<T> | null {
  const tracked = new Set<Expression | Super>();
  return getImportAccessPathInternal(node);

  /**
   * @param {import("estree").Expression} node
   * @returns {ImportAccessPathInfo | null}
   */
  function getImportAccessPathInternal(node: Expression | Super): ImportAccessPathInfo<T> | null {
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
        let propName: T | null = null;
        if (declDef.node.id.type === 'ObjectPattern') {
          const property = declDef.node.id.properties.find((property) => property.type === 'Property' && property.value.type === 'Identifier' && property.value.name === node.name);
          if (property && 'computed' in property && !property.computed && 'name' in property.key) {
            propName = property.key.name as T;
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
        let propName: T | null = null;
        let defaultImport: boolean | undefined;
        if (importDef.node.type === 'ImportSpecifier' && 'name' in importDef.node.imported) {
          propName = importDef.node.imported.name as T;
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
        path: [...nesting.path, ...('name' in node.property ? [node.property.name as T] : [])],
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
