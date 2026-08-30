'use strict';

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

const ruleName = 'detect-invisible-characters';
const Rule = require(`../../rules/${ruleName}`);

tester.run(ruleName, Rule, {
  valid: [
    {
      code: `
      var accessLevel = "user";
      if (accessLevel != "user") {
        console.log("You are an admin.");
      }
      `,
    },
    {
      code: 'var greeting = "hello world";',
    },
    {
      code: 'var s = "\\u3164";',
    },
    // Visible characters adjacent to the targets (same Unicode blocks);
    // guards against the character class being accidentally widened into a range.
    {
      code: 'var s = "ㄱㅏ";',
    },
    {
      code: 'var s = "ﾡ";',
    },
    {
      code: 'var s = "안녕하세요";',
    },
  ],
  invalid: [
    {
      code: 'var a = "hello\u3164world";',
      errors: [{ message: /Detected an invisible character introduced in this code/i, line: 1, column: 15, endLine: 1, endColumn: 16 }],
    },
    {
      code: 'var b = "foo\uffa0bar";',
      errors: [{ message: /Detected an invisible character introduced in this code/i, line: 1, column: 13, endLine: 1, endColumn: 14 }],
    },
    {
      code: 'var c = "a\u3164b\uffa0c";',
      errors: [
        { message: /Detected an invisible character introduced in this (code|comment)/i, line: 1, column: 11, endLine: 1, endColumn: 12 },
        { message: /Detected an invisible character introduced in this (code|comment)/i, line: 1, column: 13, endLine: 1, endColumn: 14 },
      ],
    },
    {
      code: 'var adm\u3164in = 1;',
      errors: [{ message: /Detected an invisible character introduced in this code/i, line: 1, column: 8, endLine: 1, endColumn: 9 }],
    },
    {
      code: 'var b\uffa0ar = 1;',
      errors: [{ message: /Detected an invisible character introduced in this code/i, line: 1, column: 6, endLine: 1, endColumn: 7 }],
    },
    {
      code: 'var t = `line1\nli\u3164ne2`;',
      errors: [{ message: /Detected an invisible character introduced in this (code|comment)/i, line: 2, column: 3, endLine: 2, endColumn: 4 }],
    },
    {
      code: 'var t = `line1\r\nli\u3164ne2`;',
      errors: [{ message: /Detected an invisible character introduced in this (code|comment)/i, line: 2, column: 3, endLine: 2, endColumn: 4 }],
    },
    {
      code: 'var t = `line1\rli\u3164ne2`;',
      errors: [{ message: /Detected an invisible character introduced in this (code|comment)/i, line: 2, column: 3, endLine: 2, endColumn: 4 }],
    },
    {
      code: 'var t = `line1\u2028li\u3164ne2`;',
      errors: [{ message: /Detected an invisible character introduced in this (code|comment)/i, line: 2, column: 3, endLine: 2, endColumn: 4 }],
    },
    {
      code: 'var t = `line1\u2029li\u3164ne2`;',
      errors: [{ message: /Detected an invisible character introduced in this (code|comment)/i, line: 2, column: 3, endLine: 2, endColumn: 4 }],
    },
    {
      code: "const checkCommands = [\n  'ping -c 1 google.com',\n  'curl -s http://example.com/',\u3164\n];",
      errors: [{ message: /Detected an invisible character introduced in this code/i, line: 3, column: 33, endLine: 3, endColumn: 34 }],
    },
  ],
});

tester.run(`${ruleName} in comment`, Rule, {
  valid: [
    {
      code: `
      // a normal comment
      var isAdmin = false;
      `,
    },
  ],
  invalid: [
    {
      code: '// hidden\u3164comment\nvar x = 1;',
      errors: [{ message: /Detected an invisible character introduced in this comment/i, line: 1, column: 10, endLine: 1, endColumn: 11 }],
    },
    {
      code: '/* a\u3164\n b\u3164 */\nvar y = 2;',
      errors: [
        { message: /Detected an invisible character introduced in this (code|comment)/i, line: 1, column: 5, endLine: 1, endColumn: 6 },
        { message: /Detected an invisible character introduced in this (code|comment)/i, line: 2, column: 3, endLine: 2, endColumn: 4 },
      ],
    },
  ],
});
