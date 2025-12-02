/**
 * Tries to detect instances of var[var]
 * @author Jon Lamendola
 */

import type { RuleModule, Stringify } from '../utils/typeHelpers.ts';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const getPath = (value: Record<string, unknown>, seen: Record<string, unknown>[], keys: string[]): string => {
  let index = seen.indexOf(value);
  const path = [keys[index]];
  for (index--; index >= 0; index--) {
    if (seen[index][path[0]] === value) {
      value = seen[index];
      path.unshift(keys[index]);
    }
  }
  return `~${path.join('.')}`;
};

const getSerialize = (fn?: (key: string, value: Record<string, unknown>) => string, decycle?: (key: string, value: Record<string, unknown>) => string) => {
  const seen = [] satisfies Record<string, unknown>[] as Record<string, unknown>[];
  const keys = [] satisfies string[] as string[];
  decycle =
    decycle ||
    function (key: string, value: Record<string, unknown>): string {
      return `[Circular ${getPath(value, seen, keys)}]`;
    };
  return function (key: string, value: Record<string, unknown>): string {
    let ret: string | Record<string, unknown> = value;
    if (typeof value === 'object' && value) {
      if (seen.indexOf(value) !== -1) {
        ret = decycle(key, value);
      } else {
        seen.push(value);
        keys.push(key);
      }
    }
    if (fn) {
      ret = fn(key, ret as Record<string, unknown>);
    }
    return ret as string;
  };
};

export const stringify: Stringify = /* @__PURE__ */ Object.assign(
  (
    obj: object,
    fn: (key: string, value: Record<string, unknown>) => string,
    spaces: Parameters<typeof JSON.stringify>[2],
    decycle: (key: string, value: Record<string, unknown>) => string
  ): string => {
    return JSON.stringify(obj, getSerialize(fn, decycle), spaces);
  },
  { getSerialize }
);

// stringify.getSerialize = getSerialize;

export const detectObjectInjectionRuleName = 'detect-object-injection' as const;

export const detectObjectInjectionRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detects "variable[key]" as a left- or right-hand assignment operand.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-object-injection.md',
    },
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (node.computed === true) {
          if (node.property.type === 'Identifier') {
            if (node.parent.type === 'VariableDeclarator') {
              context.report({ node: node, message: 'Variable Assigned to Object Injection Sink' });
            } else if (node.parent.type === 'CallExpression') {
              context.report({ node: node, message: 'Function Call Object Injection Sink' });
            } else {
              context.report({ node: node, message: 'Generic Object Injection Sink' });
            }
          }
        }
      },
    };
  },
} as const satisfies RuleModule;
