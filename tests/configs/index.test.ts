import * as pluginModule from 'eslint-plugin-security';
import plugin, { configs, meta, rules, rulesConfig } from 'eslint-plugin-security';
import assert from 'node:assert/strict';

describe('export plugin object', () => {
  it('should export rules', () => {
    assert(plugin.rules);
    assert(typeof plugin.rules['detect-unsafe-regex'] === 'object');

    assert(pluginModule.rules);
    assert(typeof pluginModule.rules['detect-unsafe-regex'] === 'object');
  });

  it('should export configs', () => {
    assert(plugin.configs);
    assert(plugin.configs.recommended);
    assert(plugin.configs['recommended-legacy']);

    assert(pluginModule.configs);
    assert(pluginModule.configs.recommended);
    assert(pluginModule.configs['recommended-legacy']);
  });

  it('namespace import and default export must reference the same instances', () => {
    assert.strictEqual(plugin.configs, pluginModule.configs);
    assert.strictEqual(plugin.meta, pluginModule.meta);
    assert.strictEqual(plugin.rules, pluginModule.rules);
    assert.strictEqual(plugin.rulesConfig, pluginModule.rulesConfig);
  });

  it('named exports and properties of the default export should be the same', () => {
    assert.strictEqual(plugin.configs, configs);
    assert.strictEqual(plugin.meta, meta);
    assert.strictEqual(plugin.rules, rules);
    assert.strictEqual(plugin.rulesConfig, rulesConfig);
  });
});
