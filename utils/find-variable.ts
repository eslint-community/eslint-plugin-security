import type { Scope } from 'eslint';

/**
 * Find the variable of a given name.
 * @param {import("eslint").Scope.Scope} scope the scope to start finding
 * @param {string} name the variable name to find.
 * @returns {import("eslint").Scope.Variable | null}
 */
export function findVariable(scope: Scope.Scope | null, name: string): Scope.Variable | null {
  while (scope != null) {
    const variable = scope.set.get(name);
    if (variable != null) {
      return variable;
    }
    scope = scope.upper;
  }
  return null;
}
