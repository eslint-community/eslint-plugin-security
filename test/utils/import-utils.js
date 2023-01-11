'use strict';

const { getImportAccessPath } = require('../../utils/import-utils');
const { deepStrictEqual } = require('assert');

const Linter = require('eslint').Linter;

function getGetImportAccessPathResult(code) {
  const linter = new Linter();
  const result = [];
  linter.defineRule('test-rule', {
    create(context) {
      return {
        'Identifier[name = target]'(node) {
          let expr = node;
          if (node.parent.type === 'MemberExpression' && node.parent.property === node) {
            expr = node.parent;
          }
          const info = getImportAccessPath({
            node: expr,
            scope: context.getScope(),
            packageNames: ['target', 'target-foo', 'target-bar'],
          });
          if (!info) return;
          result.push({
            path: info.path,
            packageName: info.packageName,
            ...(info.defaultImport ? { defaultImport: info.defaultImport } : {}),
          });
        },
      };
    },
  });

  const linterResult = linter.verify(code, {
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
    rules: {
      'test-rule': 'error',
    },
  });
  deepStrictEqual(linterResult, []);

  return result;
}

describe('getImportAccessPath', () => {
  describe('The result of getImportAccessPath should be as expected.', () => {
    for (const { code, result } of [
      {
        code: `var something = require('target');
               something.target(c);`,
        result: [
          {
            path: ['target'],
            packageName: 'target',
          },
        ],
      },
      {
        code: `var target = require('target');
               target(c);
               var { foo } = require('target-foo');
               foo.target(c);
               foo.bar.target(c);
               var { a: bar } = require('target-bar');
               bar.target(c);
               var baz = require('target-baz');
               baz.target(c);
               var qux = qux.foo.target;`,
        result: [
          {
            path: [],
            packageName: 'target',
          },
          {
            path: [],
            packageName: 'target',
          },
          {
            path: ['foo', 'target'],
            packageName: 'target-foo',
          },
          {
            path: ['foo', 'bar', 'target'],
            packageName: 'target-foo',
          },
          {
            path: ['a', 'target'],
            packageName: 'target-bar',
          },
        ],
      },
      {
        code: `require('target').target;
               function fn () {
                 var { foo } = require('target-foo');
                 foo.target(c);
               }`,
        result: [
          {
            path: ['target'],
            packageName: 'target',
          },
          {
            path: ['foo', 'target'],
            packageName: 'target-foo',
          },
        ],
      },
      {
        code: `import { foo } from 'target-foo';
               foo.target(c);
               foo.bar.target(c);
               import { a as bar } from 'target-bar';
               bar.target(c);
               import baz from 'target-baz';
               baz.target(c);`,
        result: [
          {
            path: ['foo', 'target'],
            packageName: 'target-foo',
          },
          {
            path: ['foo', 'bar', 'target'],
            packageName: 'target-foo',
          },
          {
            path: ['a', 'target'],
            packageName: 'target-bar',
          },
        ],
      },
      {
        code: `import foo from 'target-foo';
               foo.target(c);
               import * as bar from 'target-bar';
               bar.target(c);`,
        result: [
          {
            path: ['target'],
            defaultImport: true,
            packageName: 'target-foo',
          },
          {
            path: ['target'],
            packageName: 'target-bar',
          },
        ],
      },
      {
        code: `import foo from 'target-foo';
               function fn () {
                 foo.target(c);
               }`,
        result: [
          {
            path: ['target'],
            defaultImport: true,
            packageName: 'target-foo',
          },
        ],
      },
    ]) {
      it(code, () => {
        deepStrictEqual(getGetImportAccessPathResult(code), result);
      });
    }
  });
});
