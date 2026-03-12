import * as path from 'node:path';
import type { InlineConfig, Rolldown, UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';
import packageJson from './package.json' with { type: 'json' };

const cwd = import.meta.dirname;

const peerAndProductionDependencies = new Set([...Object.keys(packageJson.dependencies ?? {}), ...Object.keys(packageJson.peerDependencies ?? {})]);

const tsdownConfig = defineConfig((cliOptions) => {
  const commonOptions = {
    clean: false,
    cwd,
    deps: {
      onlyBundle: [],
      neverBundle: [...peerAndProductionDependencies, /^node:/],
    },
    devtools: {
      clean: true,
      enabled: true,
    },
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
    inputOptions: {
      experimental: {
        lazyBarrel: true,
        nativeMagicString: true,
      },
    } as const satisfies Rolldown.InputOptions,
    minify: 'dce-only',
    nodeProtocol: true,
    outDir: 'dist',
    outExtensions: ({ format }) => ({
      dts: format === 'cjs' ? '.d.cts' : '.d.ts',
      js: format === 'cjs' ? '.cjs' : '.js',
    }),
    outputOptions: {
      codeSplitting: false,
      comments: {
        annotation: true,
        jsdoc: false,
        legal: true,
      },
      strict: true,
    } as const satisfies Rolldown.OutputOptions,
    platform: 'node',
    root: 'src',
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
