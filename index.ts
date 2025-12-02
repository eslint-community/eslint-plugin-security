/**
 * eslint-plugin-security - ESLint plugin for Node Security
 */

import type { ESLint, Linter } from 'eslint';
import pkg from './package.json' with { type: 'json' };
import { detectBidiCharactersRule, detectBidiCharactersRuleName } from './rules/detect-bidi-characters.ts';
import { detectBufferNoAssertRule, detectBufferNoAssertRuleName } from './rules/detect-buffer-noassert.ts';
import { detectChildProcessRule, detectChildProcessRuleName } from './rules/detect-child-process.ts';
import { detectDisableMustacheEscapeRule, detectDisableMustacheEscapeRuleName } from './rules/detect-disable-mustache-escape.ts';
import { detectEvalWithExpressionRule, detectEvalWithExpressionRuleName } from './rules/detect-eval-with-expression.ts';
import { detectNewBufferRule, detectNewBufferRuleName } from './rules/detect-new-buffer.ts';
import { detectNoCsrfBeforeMethodOverrideRule, detectNoCsrfBeforeMethodOverrideRuleName } from './rules/detect-no-csrf-before-method-override.ts';
import { detectNonLiteralFsFilenameRule, detectNonLiteralFsFilenameRuleName } from './rules/detect-non-literal-fs-filename.ts';
import { detectNonLiteralRegExpRule, detectNonLiteralRegExpRuleName } from './rules/detect-non-literal-regexp.ts';
import { detectNonLiteralRequireRule, detectNonLiteralRequireRuleName } from './rules/detect-non-literal-require.ts';
import { detectObjectInjectionRule, detectObjectInjectionRuleName } from './rules/detect-object-injection.ts';
import { detectPossibleTimingAttacksRule, detectPossibleTimingAttacksRuleName } from './rules/detect-possible-timing-attacks.ts';
import { detectPseudoRandomBytesRule, detectPseudoRandomBytesRuleName } from './rules/detect-pseudoRandomBytes.ts';
import { detectUnsafeRegexRule, detectUnsafeRegexRuleName } from './rules/detect-unsafe-regex.ts';

const recommendedRules = {
  'security/detect-buffer-noassert': 'warn',
  'security/detect-child-process': 'warn',
  'security/detect-disable-mustache-escape': 'warn',
  'security/detect-eval-with-expression': 'warn',
  'security/detect-new-buffer': 'warn',
  'security/detect-no-csrf-before-method-override': 'warn',
  'security/detect-non-literal-fs-filename': 'warn',
  'security/detect-non-literal-regexp': 'warn',
  'security/detect-non-literal-require': 'warn',
  'security/detect-object-injection': 'warn',
  'security/detect-possible-timing-attacks': 'warn',
  'security/detect-pseudoRandomBytes': 'warn',
  'security/detect-unsafe-regex': 'warn',
  'security/detect-bidi-characters': 'warn',
} as const satisfies Linter.RulesRecord;

export const meta = {
  name: pkg.name,
  version: pkg.version,
} as const satisfies ESLint.Plugin['meta'];

export const rules = {
  [detectUnsafeRegexRuleName]: detectUnsafeRegexRule,
  [detectNonLiteralRegExpRuleName]: detectNonLiteralRegExpRule,
  [detectNonLiteralRequireRuleName]: detectNonLiteralRequireRule,
  [detectNonLiteralFsFilenameRuleName]: detectNonLiteralFsFilenameRule,
  [detectEvalWithExpressionRuleName]: detectEvalWithExpressionRule,
  [detectPseudoRandomBytesRuleName]: detectPseudoRandomBytesRule,
  [detectPossibleTimingAttacksRuleName]: detectPossibleTimingAttacksRule,
  [detectNoCsrfBeforeMethodOverrideRuleName]: detectNoCsrfBeforeMethodOverrideRule,
  [detectBufferNoAssertRuleName]: detectBufferNoAssertRule,
  [detectChildProcessRuleName]: detectChildProcessRule,
  [detectDisableMustacheEscapeRuleName]: detectDisableMustacheEscapeRule,
  [detectObjectInjectionRuleName]: detectObjectInjectionRule,
  [detectNewBufferRuleName]: detectNewBufferRule,
  [detectBidiCharactersRuleName]: detectBidiCharactersRule,
} as const satisfies ESLint.Plugin['rules'];

export const rulesConfig = {
  'detect-unsafe-regex': 0,
  'detect-non-literal-regexp': 0,
  'detect-non-literal-require': 0,
  'detect-non-literal-fs-filename': 0,
  'detect-eval-with-expression': 0,
  'detect-pseudoRandomBytes': 0,
  'detect-possible-timing-attacks': 0,
  'detect-no-csrf-before-method-override': 0,
  'detect-buffer-noassert': 0,
  'detect-child-process': 0,
  'detect-disable-mustache-escape': 0,
  'detect-object-injection': 0,
  'detect-new-buffer': 0,
  'detect-bidi-characters': 0,
} as const satisfies Linter.Config['rules'];

const recommendedLegacy = {
  plugins: ['security'],
  rules: recommendedRules,
} as const satisfies Linter.LegacyConfig;

const recommended = {
  name: 'security/recommended',
  plugins: {
    get security(): ESLint.Plugin {
      return plugin;
    },
  },
  rules: recommendedRules,
} as const satisfies Linter.Config;

export const configs = {
  recommended,
  'recommended-legacy': recommendedLegacy,
} as const satisfies { recommended: Linter.Config; 'recommended-legacy': Linter.LegacyConfig } satisfies ESLint.Plugin['configs'];

const plugin = {
  meta,
  rules,
  rulesConfig,
  configs,
} as const satisfies ESLint.Plugin & { rulesConfig: Linter.Config['rules'] };

export default plugin;
