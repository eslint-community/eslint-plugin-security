import type { GenerateOptions } from 'eslint-doc-generator';
import * as path from 'node:path';
import { format, resolveConfig } from 'prettier';

const config = {
  ignoreConfig: ['recommended-legacy'],
  postprocess: async (doc, pathToFile) => {
    const prettierConfig = (await resolveConfig(pathToFile, { config: path.join(import.meta.dirname, '.prettierrc.json') })) ?? {};
    return await format(doc, { ...prettierConfig, filepath: pathToFile, parser: 'markdown' });
  },
} as const satisfies GenerateOptions;

export default config;
