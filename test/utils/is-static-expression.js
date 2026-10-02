'use strict';

const { isStaticExpression } = require('../../utils/is-static-expression');
const { deepStrictEqual } = require('assert');

const Linter = require('eslint').Linter;

/**
 * Get the return value using `isStaticExpression()`.
 * Give `isStaticExpression()` the argument given to `target()` in the code as an expression.
 */
function getIsStaticExpressionResult(code) {
  const linter = new Linter();
  const result = [];
  const testRule = {
    create(context) {
      const sourceCode = context.sourceCode || context.getSourceCode();

      return {
        'CallExpression[callee.name = target]'(node) {
          const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

          result.push(
            ...node.arguments.map((expr) =>
              isStaticExpression({
                node: expr,
                scope,
              })
            )
          );
        },
      };
    },
  };

  const linterResult = linter.verify(code, {
    plugins: {
      test: {
        rules: {
          'test-rule': testRule,
        },
      },
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'test/test-rule': 'error',
    },
  });
  deepStrictEqual(linterResult, []);

  return result;
}

describe('isStaticExpression', () => {
  describe('The result of isStaticExpression should be as expected.', () => {
    for (const { code, result } of [
      {
        code: `target('foo');`,
        result: [true],
      },
      {
        code: `target(a);`,
        result: [false],
      },
      {
        code: `
        const a = 'i'
        target(a);`,
        result: [true],
      },
      {
        code: `
        const a = b
        target(a);`,
        result: [false],
      },
      {
        code: `
        const a = a
        target(a);`,
        result: [false],
      },
      {
        code: `
        var a = 'foo'
        var a = 'bar'
        target(a);`,
        result: [false],
      },
      {
        code: `
        var a = 'foo'
        a = 'bar'
        var b = 'bar'
        target(a);
        target(b);`,
        result: [false, true],
      },
      {
        code: `target(\`foo\`);`,
        result: [true],
      },
      {
        code: `
        target(\`foo\${a}\`);`,
        result: [false],
      },
      {
        code: `
        const a = 'i'
        target(\`foo\${a}\`);`,
        result: [true],
      },
      {
        code: `
        const a = 'i'
        target('foo' + 'bar');
        target(a + 'foo');
        target('foo' + a + 'bar');
        `,
        result: [true, true, true],
      },
      {
        code: `
        const a = 'i'
        target(b + 'bar');
        target('foo' + a + b);
        `,
        result: [false, false],
      },
      {
        code: `
        target(__dirname, __filename);
        `,
        result: [true, true],
      },
      {
        code: `
        function fn(__dirname) {
          target(__dirname, __filename);
        }
        `,
        result: [false, true],
      },
      {
        code: `
        const __filename = a
        target(__dirname, __filename);
        `,
        result: [true, false],
      },
      {
        code: `
        import path from 'path';
        target(path.resolve(__dirname, './index.html'));
        target(path.join(__dirname, './ssl.key'));
        target(path.resolve(__dirname, './sitemap.xml'));
        `,
        result: [true, true, true],
      },
      {
        code: `
        import { posix as path } from 'path';
        target(path.resolve(__dirname, './index.html'));
        `,
        result: [true],
      },
      {
        code: `
        const path = require('path');
        target(path.resolve(__dirname, './index.html'));
        `,
        result: [true],
      },
      {
        code: `
        import path from 'unknown';
        target(path.resolve(__dirname, './index.html'));
        `,
        result: [false],
      },
      {
        code: `
        import path from 'path';
        target(path.unknown(__dirname, './index.html'));
        `,
        result: [false],
      },
      {
        code: `
        import path from 'path';
        target(path.resolve.unknown(__dirname, './index.html'));
        `,
        result: [false],
      },
      {
        code: `
        import path from 'path';
        const FOO = 'static'
        target(path.resolve(__dirname, foo));
        target(path.resolve(__dirname, FOO));
        `,
        result: [false, true],
      },
      {
        code: `
        import path from 'path';
        const FOO = 'static'
        target(__dirname + path.sep + foo);
        target(__dirname + path.sep + FOO);
        `,
        result: [false, true],
      },
      {
        code: `
        target(require.resolve('static'));
        target(require.resolve(foo));
        `,
        result: [true, false],
      },
      {
        code: `
        target(require);
        target(require('static'));
        `,
        result: [false, false],
      },
      {
        code: `
        import url from "node:url";
        import path from "node:path";

        const filename = url.fileURLToPath(import.meta.url);
        const dirname = path.dirname(url.fileURLToPath(import.meta.url));

        target(filename);
        target(dirname);
        `,
        result: [true, true],
      },
      {
        code: `
        import url from "node:url";
        target(import.meta.url);
        target(url.unknown(import.meta.url));
        `,
        result: [true, false],
      },
      {
        code: `
        target(import.meta.dirname);
        target(import.meta.filename);
        `,
        result: [true, true],
      },
      {
        code: `
        target(import.meta[prop]);
        target(import.meta.resolve('static'));
        `,
        result: [false, false],
      },
      {
        code: `
        import os from 'os';
        import { tmpdir } from 'node:os';
        const os2 = require('node:os');
        const { tmpdir: tmpdir2 } = require('os');
        target(os.tmpdir());
        target(tmpdir());
        target(os2.tmpdir());
        target(tmpdir2());
        target(require('os').tmpdir());
        `,
        result: [true, true, true, true, true],
      },
      {
        code: `
        import os from 'unknown';
        import os2 from 'node:os';
        target(os.tmpdir());
        target(os2.tmpdir.unknown());
        target(os2.homedir());
        `,
        result: [false, false, false],
      },
      {
        code: `
        import fs from 'fs';
        import { mkdtempSync } from 'node:fs';
        import { mkdtemp } from 'node:fs/promises';
        const fs2 = require('fs');
        const { mkdtemp: mkdtemp2 } = require('fs/promises');
        const { promises } = require('node:fs');
        target(fs.mkdtempSync('prefix'));
        target(mkdtempSync('prefix'));
        target(fs.promises.mkdtemp('prefix'));
        target(mkdtemp('prefix'));
        target(await fs.promises.mkdtemp('prefix'));
        target(await mkdtemp('prefix'));
        target(fs2.promises.mkdtemp('prefix'));
        target(mkdtemp2('prefix'));
        target(promises.mkdtemp('prefix'));
        `,
        result: [true, true, true, true, true, true, true, true, true],
      },
      {
        code: `
        import { mkdtempSync } from 'node:fs';
        import { mkdtemp } from 'node:fs/promises';
        import { mkdtemp as mkdtempCallback } from 'node:fs';
        import fs from 'unknown';
        target(mkdtempSync(dynamic));
        target(await mkdtemp(dynamic));
        target(mkdtempSync());
        target(mkdtempCallback('prefix'));
        target(fs.mkdtempSync('prefix'));
        `,
        result: [false, false, false, false, false],
      },
      {
        code: `
        import os from 'node:os';
        import { mkdtempSync } from 'node:fs';
        import path from 'node:path';

        const root = mkdtempSync(path.join(os.tmpdir(), 'fixture-'));
        const checkout = path.join(root, 'checkout');

        target(root);
        target(checkout);
        `,
        result: [true, true],
      },
      {
        code: `
        import os from 'node:os';
        import { mkdtemp } from 'node:fs/promises';
        import path from 'node:path';

        const root = await mkdtemp(path.join(os.tmpdir(), 'fixture-'));
        const checkout = path.join(root, 'checkout');

        target(root);
        target(checkout);
        `,
        result: [true, true],
      },
    ]) {
      it(code, () => {
        deepStrictEqual(getIsStaticExpressionResult(code), result);
      });
    }
  });
});
