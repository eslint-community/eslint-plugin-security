import type { AST, Linter, Rule, Scope } from 'eslint';
import type * as ESTree from 'estree';
import type { Buffer } from 'node:buffer';
import type * as childProcess from 'node:child_process';
import type * as path from 'node:path';
import type * as url from 'node:url';
import type { getImportAccessPath } from './import-utils.ts';

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

export type PathModuleType = Simplify<typeof path>;
export type PathModuleKeys = Simplify<keyof PathModuleType>;

export type ChildProcessModuleType = Simplify<typeof childProcess>;
export type ChildProcessModuleKeys = Simplify<keyof ChildProcessModuleType>;

export type UrlType = Simplify<typeof url>;
export type UrlKeys = Simplify<keyof UrlType>;

export type PathConstructionMethodNames = {
  [Key in PathModuleKeys]: PathModuleType[Key] extends ((firstArgument: string, ...args: unknown[]) => string) | ((...args: string[]) => string) ? Key : never;
}[PathModuleKeys];

export type PathStaticMemberNames = {
  [Key in PathModuleKeys]: PathModuleType[Key] extends PropertyKey ? Key : never;
}[PathModuleKeys];

export type ImportAccessPathInfo<AccessPathPropertyNames extends string = PathConstructionMethodNames> = {
  path: AccessPathPropertyNames[];
  defaultImport?: boolean;
  packageName: string;
  node: Simplify<SimpleCallExpression | ImportDeclaration>;
};

export type BufferReadMethodKeys = Simplify<ExtractStrict<keyof Buffer, `read${string}`>>;

export type BufferWriteMethodKeys = Simplify<ExcludeStrict<ExtractStrict<keyof Buffer, `write${string}`>, 'write'>>;

export type ImportAccessInfo = Simplify<Pick<NonNullable<ReturnType<typeof getImportAccessPath>>, 'path' | 'packageName'> & ({ defaultImport: true } | { defaultImport?: never })>;

export type Stringify = {
  (
    obj: object,
    fn: (key: string, value: Record<string, unknown>) => string,
    spaces: Simplify<Parameters<typeof JSON.stringify>[2]>,
    decycle: (key: string, value: Record<string, unknown>) => string
  ): string;

  getSerialize: (
    fn?: (key: string, value: Record<string, unknown>) => string,
    decycle?: (key: string, value: Record<string, unknown>) => string
  ) => (key: string, value: Record<string, unknown>) => string;
};

// ESLint Types

export type Token = Simplify<AST.Token>;
export type Program = Simplify<AST.Program>;
export type CommentOrToken = Simplify<Token | Comment>;

export type RuleModule = Simplify<Rule.RuleModule>;
export type RuleContext = Simplify<Rule.RuleContext>;
export type NodeParentExtension = Simplify<Rule.NodeParentExtension>;

export type LintMessage = Simplify<Linter.LintMessage>;

export type Scope = Simplify<Scope.Scope>;
export type Variable = Simplify<Scope.Variable>;
export type Definition = Simplify<Scope.Definition>;

export type NodeTypeMapping = { [NodeType in Rule.NodeTypes]: { type: NodeType } };
export type GetBareNodeObject<NodeType extends Rule.NodeTypes> = NodeType extends NodeType ? Simplify<NodeTypeMapping[NodeType]> : never;

// ESTree Types

export type SimpleCallExpression = Simplify<ESTree.SimpleCallExpression>;
export type ImportDeclaration = Simplify<ESTree.ImportDeclaration>;
export type Comment = Simplify<ESTree.Comment>;
export type Position = Simplify<ESTree.Position>;
export type Expression = Simplify<ESTree.Expression>;
export type Identifier = Simplify<ESTree.Identifier>;
export type ImportDefaultSpecifier = Simplify<ESTree.ImportDefaultSpecifier>;
export type ImportNamespaceSpecifier = Simplify<ESTree.ImportNamespaceSpecifier>;
export type ImportSpecifier = Simplify<ESTree.ImportSpecifier>;
export type Literal = Simplify<ESTree.Literal>;
export type Node = Simplify<ESTree.Node>;
export type Super = Simplify<ESTree.Super>;
export type VariableDeclarator = Simplify<ESTree.VariableDeclarator>;
export type BinaryExpression = Simplify<ESTree.BinaryExpression>;
export type MemberExpression = Simplify<ESTree.MemberExpression>;
export type SpreadElement = Simplify<ESTree.SpreadElement>;
export type MetaProperty = Simplify<ESTree.MetaProperty>;
