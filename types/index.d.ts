/**
 * `eslint-plugin-security` - ESLint plugin for Node Security.
 */

import type { ESLint, Linter, Rule } from 'eslint';

declare namespace plugin {
  /**
   * The name of every rule shipped by this plugin, without the
   * `security/` prefix.
   */
  type RuleName =
    | 'detect-bidi-characters'
    | 'detect-buffer-noassert'
    | 'detect-child-process'
    | 'detect-disable-mustache-escape'
    | 'detect-eval-with-expression'
    | 'detect-new-buffer'
    | 'detect-no-csrf-before-method-override'
    | 'detect-non-literal-fs-filename'
    | 'detect-non-literal-regexp'
    | 'detect-non-literal-require'
    | 'detect-object-injection'
    | 'detect-possible-timing-attacks'
    | 'detect-pseudoRandomBytes'
    | 'detect-unsafe-regex';
}

/**
 * The plugin object, ready to be used as a `security` entry in the
 * `plugins` of an ESLint config.
 */
declare const plugin: Required<Pick<ESLint.Plugin, 'meta' | 'configs'>> & {
  /**
   * Metadata of this plugin, taken from the `package.json` of the
   * `eslint-plugin-security` package.
   */
  meta: Required<NonNullable<ESLint.ObjectMetaProperties['meta']>>;

  /**
   * Every rule this plugin ships, keyed by
   * {@linkcode plugin.RuleName | RuleName}.
   */
  rules: Record<plugin.RuleName, Rule.RuleModule>;

  /**
   * Default severity of every rule, kept for backwards compatibility with
   * legacy (eslintrc) tooling.
   */
  rulesConfig: Record<plugin.RuleName, Linter.Severity>;

  /**
   * The shareable configs of this plugin.
   */
  configs: {
    /**
     * Flat config, for `eslint.config.js`.
     * It turns every rule of this plugin on as a warning.
     */
    readonly recommended: Pick<Linter.Config, 'name' | 'plugins' | 'rules'>;

    /**
     * Legacy (eslintrc) config, for `.eslintrc.*` files.
     * It enables the same rules as
     * {@linkcode plugin.configs.recommended | recommended}.
     */
    readonly 'recommended-legacy': Pick<Linter.LegacyConfig, 'plugins' | 'rules'>;
  };
};

export = plugin;
