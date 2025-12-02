import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { InlineConfig, UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';
import packageJson from './package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tsdownConfig = defineConfig((cliOptions) => {
  const commonOptions = {
    clean: false,
    cwd: __dirname,
    dts: {
      emitJs: false,
      newContext: true,
      oxc: false,
      resolver: 'tsc',
      sideEffects: false,
      sourcemap: true,
    },
    entry: {
      index: 'index.ts',
    },
    minify: 'dce-only',
    treeshake: {
      annotations: true,
      commonjs: true,
      moduleSideEffects: false,
    },
    failOnWarn: true,
    fixedExtension: false,
    format: ['es', 'cjs'],
    hash: false,
    nodeProtocol: true,
    shims: true,
    sourcemap: true,
    outExtensions: ({ format }) => ({
      dts: format === 'cjs' ? '.d.cts' : '.d.ts',
      js: format === 'cjs' ? '.cjs' : '.js',
    }),
    outDir: 'dist',
    platform: 'node',
    target: ['esnext', 'node20'],
    tsconfig: path.join(__dirname, 'tsconfig.build.json'),
    ...cliOptions,
  } as const satisfies InlineConfig;

  return [
    {
      ...commonOptions,
      name: `${packageJson.name} Modern Dual Format`,
    },
  ] as const satisfies UserConfig[];
});

export default tsdownConfig;
