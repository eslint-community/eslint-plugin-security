/**
 * Detect trojan source attacks that employ unicode bidi attacks to inject malicious code
 * @author Luciamo Mammino
 * @author Simone Sanfratello
 * @author Liran Tal
 */

'use strict';

const dangerousBidiCharsRegexp = /[\u061C\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069]/gu;

function hasTrojanSource({ sourceText, offsetLine }) {
  const sourceTextToSearch = sourceText.toString();

  const lines = sourceTextToSearch.split(/\r?\n/);

  return lines.reduce((reports, line, lineIndex) => {
    let match;
    let offset = lineIndex == 0 ? offsetLine : 0;

    while ((match = dangerousBidiCharsRegexp.exec(line)) !== null) {
      reports.push({ line: lineIndex, column: offset + match.index });
    }

    return reports;
  }, []);
}

function report({ context, node, tokens, message }) {
  if (!tokens || !Array.isArray(tokens)) {
    return;
  }
  tokens.forEach((token) => {
    const reports = hasTrojanSource({ sourceText: token.value, offsetLine: token.loc.start.column });

    reports.forEach((report) => {
      context.report({
        node: node,
        data: {
          text: token.value,
        },
        loc: {
          start: {
            line: token.loc.start.line + report.line,
            column: report.column,
          },
          end: {
            line: token.loc.start.line + report.line,
            column: report.column + 1,
          },
        },
        message,
      });
    });
  });
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Detects trojan source attacks that employ unicode bidi attacks to inject malicious code.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-trojan-source.md',
    },
  },
  create: function (context) {
    return {
      Program: function (node) {
        report({ context, node, tokens: node.tokens, message: "Detected potential trojan source attack with unicode bidi introduced in this code: '{{text}}'." });
        report({ context, node, tokens: node.comments, message: "Detected potential trojan source attack with unicode bidi introduced in this comment: '{{text}}'." });
      },
    };
  },
};
