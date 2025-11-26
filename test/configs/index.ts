import assert from 'node:assert/strict';
import plugin from '../../index.js';

describe('export plugin object', () => {
  it('should export rules', () => {
    assert(plugin.rules);
    assert(typeof plugin.rules['detect-unsafe-regex'] === 'object');
  });

  it('should export configs', () => {
    assert(plugin.configs);
    assert(plugin.configs['recommended']);
    assert(plugin.configs['recommended-legacy']);
  });
});
