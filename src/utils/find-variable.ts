import type { Scope, Variable } from './typeHelpers.ts';

/**
 * Find the variable with a given name.
 *
 * @param scope - the scope to start finding
 * @param name - the variable name to find.
 * @returns the found variable or `null` if not found.
 */
export function findVariable(scope: Scope | null, name: string): Variable | null {
  while (scope != null) {
    const variable = scope.set.get(name);
    if (variable != null) {
      return variable;
    }
    scope = scope.upper;
  }
  return null;
}
