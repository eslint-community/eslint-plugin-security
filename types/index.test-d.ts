/**
 * Compile time only checks for `types/index.d.ts`.
 *
 * Nothing in this file is executed, it is type checked by `npm run lint:types`.
 */

import type { ESLint, Linter, Rule } from 'eslint';
import expectTypeModule = require('expect-type');
import expectTypeOf = expectTypeModule.expectTypeOf;
import security = require('./index.js');

// The plugin is usable wherever ESLint expects a plugin.
expectTypeOf(security).toExtend<ESLint.Plugin>();

expectTypeOf(security).toHaveProperty('meta').toMatchObjectType<{ name: string | undefined; version: string | undefined }>();

// Rules are keyed by their unprefixed name.
expectTypeOf(security).toHaveProperty('rules').toHaveProperty('detect-object-injection').toEqualTypeOf<Rule.RuleModule>();

expectTypeOf(security).toHaveProperty('rulesConfig').toHaveProperty('detect-unsafe-regex').toEqualTypeOf<Linter.Severity>();

// Both configs are exposed, each with its own shape.
expectTypeOf(security).toHaveProperty('configs').toHaveProperty('recommended').toExtend<Linter.Config>();
expectTypeOf(security).toHaveProperty('configs').toHaveProperty('recommended-legacy').toExtend<Linter.LegacyConfig>();

// Flat config usage, as it appears in an `eslint.config.js`.
const config = [
  security.configs.recommended,
  {
    plugins: { security },
    rules: {
      'security/detect-child-process': 'error',
    },
  },
] satisfies Linter.Config[];

expectTypeOf(config).items.toExtend<Linter.Config>();
