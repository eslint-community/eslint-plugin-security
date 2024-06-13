/**
 * eslint-plugin-security - ESLint plugin for Node Security
 */

'use strict';

const pkg = require('./package.json');

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    'detect-unsafe-regex': require('./rules/detect-unsafe-regex'),
    'detect-non-literal-regexp': require('./rules/detect-non-literal-regexp'),
    'detect-non-literal-require': require('./rules/detect-non-literal-require'),
    'detect-non-literal-fs-filename': require('./rules/detect-non-literal-fs-filename'),
    'detect-eval-with-expression': require('./rules/detect-eval-with-expression'),
    'detect-pseudoRandomBytes': require('./rules/detect-pseudoRandomBytes'),
    'detect-possible-timing-attacks': require('./rules/detect-possible-timing-attacks'),
    'detect-no-csrf-before-method-override': require('./rules/detect-no-csrf-before-method-override'),
    'detect-buffer-noassert': require('./rules/detect-buffer-noassert'),
    'detect-child-process': require('./rules/detect-child-process'),
    'detect-disable-mustache-escape': require('./rules/detect-disable-mustache-escape'),
    'detect-object-injection': require('./rules/detect-object-injection'),
    'detect-new-buffer': require('./rules/detect-new-buffer'),
    'detect-bidi-characters': require('./rules/detect-bidi-characters'),
  },
  rulesConfig: {
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
  },
  configs: {}, // was assigned later so we can reference `plugin`
};

const recommended = {
  name: 'security/recommended',
  plugins: { security: plugin },
  rules: {
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
  },
};

const recommendedLegacy = {
  plugins: ['security'],
  rules: recommended.rules,
};

Object.assign(plugin.configs, {
  recommended,
  'recommended-legacy': recommendedLegacy
});

module.exports = plugin;
