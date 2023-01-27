'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester({
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
});

const ruleName = 'detect-non-literal-fs-filename';

tester.run(ruleName, require(`../rules/${ruleName}`), {
  valid: [
    {
      code: `var fs = require('fs');
             var a = fs.open('test')`,
    },
    {
      code: `var something = require('some');
             var a = something.readFile(c);`,
    },
    {
      code: `var something = require('fs').readFile, readFile = require('foo').readFile;
             readFile(c);`,
    },
    {
      code: `
            import { promises as fsp } from 'fs';
            import fs from 'fs';
            import path from 'path';
            
            const index = await fsp.readFile(path.resolve(__dirname, './index.html'), 'utf-8');
            const key = fs.readFileSync(path.join(__dirname, './ssl.key'));
            await fsp.writeFile(path.resolve(__dirname, './sitemap.xml'), sitemap);`,
      globals: {
        __dirname: 'readonly',
      },
    },
    {
      code: `
            import fs from 'fs';
            import path from 'path';
            const dirname = path.dirname(__filename)
            const key = fs.readFileSync(path.resolve(dirname, './index.html'));`,
      globals: {
        __filename: 'readonly',
      },
    },
    {
      code: `
            import fs from 'fs';
            const key = fs.readFileSync(\`\${process.cwd()}/path/to/foo.json\`);`,
      globals: {
        process: 'readonly',
      },
    },
    `
    import fs from 'fs';
    import path from 'path';
    import url from 'url';
    const dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const html = fs.readFileSync(path.resolve(dirname, './index.html'), 'utf-8');`,
    {
      code: `
      import fs from 'fs';
      const pkg = fs.readFileSync(require.resolve('eslint/package.json'), 'utf-8');`,
      globals: {
        require: 'readonly',
      },
    },
  ],
  invalid: [
    /// requires
    {
      code: `var something = require('fs');
             var a = something.open(c);`,
      errors: [{ message: 'Found open from package "fs" with non literal argument at index 0' }],
    },
    {
      code: `var one = require('fs').readFile;
             one(filename);`,
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: `var one = require('node:fs').readFile;
             one(filename);`,
      errors: [{ message: 'Found readFile from package "node:fs" with non literal argument at index 0' }],
    },
    {
      code: `var one = require('fs/promises').readFile;
             one(filename);`,
      errors: [{ message: 'Found readFile from package "fs/promises" with non literal argument at index 0' }],
    },
    {
      code: `var something = require('fs/promises');
             something.readFile(filename);`,
      errors: [{ message: 'Found readFile from package "fs/promises" with non literal argument at index 0' }],
    },
    {
      code: `var something = require('node:fs/promises');
             something.readFile(filename);`,
      errors: [{ message: 'Found readFile from package "node:fs/promises" with non literal argument at index 0' }],
    },
    {
      code: `var something = require('fs-extra');
             something.readFile(filename);`,
      errors: [{ message: 'Found readFile from package "fs-extra" with non literal argument at index 0' }],
    },
    {
      code: `var { readFile: something } = require('fs');
             something(filename)`,
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    //// imports
    {
      code: `import { readFile as something } from 'fs';
             something(filename);`,
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: `import { readFile as something } from 'node:fs';
             something(filename);`,
      errors: [{ message: 'Found readFile from package "node:fs" with non literal argument at index 0' }],
    },
    {
      code: `import { readFile as something } from 'fs-extra';
             something(filename);`,
      errors: [{ message: 'Found readFile from package "fs-extra" with non literal argument at index 0' }],
    },
    {
      code: `import { readFile as something } from 'fs/promises'
             something(filename)`,
      errors: [{ message: 'Found readFile from package "fs/promises" with non literal argument at index 0' }],
    },
    {
      code: `import { readFile as something } from 'node:fs/promises'
             something(filename)`,
      errors: [{ message: 'Found readFile from package "node:fs/promises" with non literal argument at index 0' }],
    },
    {
      code: `import * as something from 'fs';
             something.readFile(filename);`,
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: `import * as something from 'node:fs';
             something.readFile(filename);`,
      errors: [{ message: 'Found readFile from package "node:fs" with non literal argument at index 0' }],
    },
    /// promises
    {
      code: `var something = require('fs').promises;
             something.readFile(filename)`,
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: `var something = require('node:fs').promises;
             something.readFile(filename)`,
      errors: [{ message: 'Found readFile from package "node:fs" with non literal argument at index 0' }],
    },
    {
      code: `var something = require('fs');
             something.promises.readFile(filename)`,
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: `var something = require('node:fs');
             something.promises.readFile(filename)`,
      errors: [{ message: 'Found readFile from package "node:fs" with non literal argument at index 0' }],
    },
    {
      code: "var fs = require('fs');\nfs.readFile(`template with ${filename}`);",
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    // inline
    {
      code: "function foo () {\nvar fs = require('fs');\nfs.readFile(filename);\n}",
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: "function foo () {\nvar { readFile: something } = require('fs');\nsomething(filename);\n}",
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: "var fs = require('fs');\nfunction foo () {\nvar { readFile: something } = fs.promises;\nsomething(filename);\n}",
      errors: [{ message: 'Found readFile from package "fs" with non literal argument at index 0' }],
    },
    {
      code: `
            import fs from 'fs';
            import path from 'path';
            const key = fs.readFileSync(path.resolve(__dirname, foo));`,
      globals: {
        __filename: 'readonly',
      },
      errors: [{ message: 'Found readFileSync from package "fs" with non literal argument at index 0' }],
    },
  ],
});
