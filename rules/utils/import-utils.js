/**
 * Returns the ImportDeclaration for the import of the methodName from one of the packageNames
 * import { methodName as a } from 'packageName';
 *
 * @param {Object} param0
 * @param {string} param0.methodName
 * @param {string[]} param0.packageNames
 * @param {Object} param0.program The AST program object
 * @returns The ImportDeclaration for the import of the methodName from one of the packageNames
 */
module.exports.getImportDeclaration = ({ methodName, packageNames, program }) =>
  program.body.find((entry) => entry.type === 'ImportDeclaration' && packageNames.includes(entry.source.value) && entry.specifiers.some((s) => s.local.name === methodName));

/**
 * Returns the VariableDeclaration for a require based import
 *
 * @param {Object} param0
 * @param {Function} param0.condition Optional function to check additional conditions on the resulting VariableDeclaration
 * @param {boolean} param0.hasObject Whether the information is received by declaration.init or declaration.init.object
 * @param {string[]} param0.packageNames The interesting packages the method is imported from
 * @param {Object} param0.program The AST program object
 * @returns
 */
module.exports.getVariableDeclaration = ({ condition, hasObject, packageNames, program }) =>
  program.body
    // a node import is a variable declaration
    .filter((entry) => entry.type === 'VariableDeclaration')
    // one var/let/const may contain multiple declarations, separated by comma, after the "=" sign
    .flatMap((d) => d.declarations)
    .find((d) => {
      const init = hasObject ? d.init.object : d.init;

      return (
        init &&
        init.callee &&
        init.callee.name === 'require' &&
        init.arguments[0].type === 'Literal' &&
        packageNames.includes(init.arguments[0].value) &&
        (!condition || condition(d))
      );
    });
