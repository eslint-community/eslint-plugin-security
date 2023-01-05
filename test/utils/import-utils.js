'use strict';

const { getImportAccessPath } = require('../../utils/import-utils');

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const testRuleForGetImportAccessPath = {
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
        delete info.node;
        context.report({
          node,
          message: JSON.stringify(info),
        });
      },
    };
  },
};

tester.run('getImportAccessPath', testRuleForGetImportAccessPath, {
  valid: [],
  invalid: [
    {
      code: `var something = require('target');
             something.target(c);`,
      errors: [
        JSON.stringify({
          path: ['target'],
          packageName: 'target',
        }),
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
      errors: [
        JSON.stringify({
          path: [],
          packageName: 'target',
        }),
        JSON.stringify({
          path: [],
          packageName: 'target',
        }),
        JSON.stringify({
          path: ['foo', 'target'],
          packageName: 'target-foo',
        }),
        JSON.stringify({
          path: ['foo', 'bar', 'target'],
          packageName: 'target-foo',
        }),
        JSON.stringify({
          path: ['a', 'target'],
          packageName: 'target-bar',
        }),
      ],
    },
    {
      code: `require('target').target;
             function fn () {
               var { foo } = require('target-foo');
               foo.target(c);
             }`,
      errors: [
        JSON.stringify({
          path: ['target'],
          packageName: 'target',
        }),
        JSON.stringify({
          path: ['foo', 'target'],
          packageName: 'target-foo',
        }),
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
      errors: [
        JSON.stringify({
          path: ['foo', 'target'],
          packageName: 'target-foo',
        }),
        JSON.stringify({
          path: ['foo', 'bar', 'target'],
          packageName: 'target-foo',
        }),
        JSON.stringify({
          path: ['a', 'target'],
          packageName: 'target-bar',
        }),
      ],
    },
    {
      code: `import foo from 'target-foo';
             foo.target(c);
             import * as bar from 'target-bar';
             bar.target(c);`,
      errors: [
        JSON.stringify({
          path: ['target'],
          defaultImport: true,
          packageName: 'target-foo',
        }),
        JSON.stringify({
          path: ['target'],
          packageName: 'target-bar',
        }),
      ],
    },
    {
      code: `import foo from 'target-foo';
             function fn () {
               foo.target(c);
             }`,
      errors: [
        JSON.stringify({
          path: ['target'],
          defaultImport: true,
          packageName: 'target-foo',
        }),
      ],
    },
  ],
});
