import * as path from 'node:path';
import type { InlineConfig, UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';
import packageJson from './package.json' with { type: 'json' };

const cwd = import.meta.dirname;

const tsdownConfig = defineConfig((cliOptions) => {
  const commonOptions = {
    clean: false,
    cwd,
    dts: {
      cwd,
      emitJs: false,
      enabled: true,
      newContext: true,
      oxc: false,
      resolver: 'tsc',
      sideEffects: false,
      sourcemap: true,
    },
    entry: {
      index: 'src/index.ts',
    },
    failOnWarn: true,
    fixedExtension: false,
    format: ['cjs', 'es'],
    hash: false,
    inlineOnly: [],
    minify: 'dce-only',
    nodeProtocol: true,
    outDir: 'dist',
    outExtensions: ({ format }) => ({
      dts: format === 'cjs' ? '.d.cts' : '.d.ts',
      js: format === 'cjs' ? '.cjs' : '.js',
    }),
    platform: 'node',
    shims: true,
    sourcemap: true,
    target: ['esnext'],
    treeshake: {
      moduleSideEffects: false,
    },
    tsconfig: path.join(cwd, 'tsconfig.build.json'),
    ...cliOptions,
  } as const satisfies InlineConfig;

  return [
    {
      ...commonOptions,
      name: packageJson.name,
    },
  ] as const satisfies UserConfig[];
});

export default tsdownConfig;
