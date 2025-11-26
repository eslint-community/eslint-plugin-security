import jsPlugin from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginRecommendedConfig from 'eslint-plugin-eslint-plugin';
import { defineConfig } from 'eslint/config';

const eslintPluginConfigs = defineConfig([
  eslintPluginRecommendedConfig.configs.recommended,
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
]);

export default defineConfig([
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
]);
