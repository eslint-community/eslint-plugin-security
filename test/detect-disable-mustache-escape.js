'use strict';

import { RuleTester } from 'eslint';
import Rule from '../rules/detect-disable-mustache-escape.js';

const tester = new RuleTester();

const ruleName = 'detect-disable-mustache-escape';

tester.run(ruleName, Rule, {
  valid: [{ code: 'escapeMarkup = false' }],
  invalid: [
    {
      code: 'a.escapeMarkup = false',
      errors: [{ message: 'Markup escaping disabled.' }],
    },
  ],
});
