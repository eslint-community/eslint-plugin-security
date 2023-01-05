const { format } = require('prettier');
const { prettier: prettierRC } = require('./.prettierrc.json');

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  postprocess: (doc) => format(doc, { ...prettierRC, parser: 'markdown' }),
};

module.exports = config;
