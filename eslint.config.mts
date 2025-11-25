'use strict';

const jsPlugin = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');
const eslintPluginRecommendedConfig = require('eslint-plugin-eslint-plugin/configs/recommended');

const eslintPluginConfigs = [
  eslintPluginRecommendedConfig,
  {
    rules: {
      'eslint-plugin/prefer-message-ids': 'off', // TODO: enable
      'eslint-plugin/require-meta-docs-description': ['error', { pattern: '^(Detects|Enforces|Requires|Disallows) .+\\.$' }],
      'eslint-plugin/require-meta-docs-url': [
        'error',
        {
          pattern: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/{{name}}.md',
        },
      ],
      'eslint-plugin/require-meta-schema': 'off', // TODO: enable
      'eslint-plugin/require-meta-type': 'off', // TODO: enable
    },
  },
];

module.exports = [
  jsPlugin.configs.recommended,
  prettierConfig,
  ...eslintPluginConfigs,
  {
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
      },
    },
  },
];
