/**
 * Detect trojan source attacks that employ unicode bidi attacks to inject malicious code
 * @author Luciamo Mammino
 * @author Simone Sanfratello
 * @author Liran Tal
 */

'use strict';

const dangerousBidiCharsRegexp = /[\u061C\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069]/gu;

/**
 * Detects all the dangerous bidi characters in a given source text
 *
 * @param {object} options - Options
 * @param {string} options.sourceText - The source text to search for dangerous bidi characters
 * @param {number} options.firstLineOffset - The offset of the first line in the source text
 * @returns {Array<{line: number, column: number}>} - An array of reports, each report is an
 *    object with the line and column of the dangerous character
 */
function detectBidiCharacters({ sourceText, firstLineOffset }) {
  const sourceTextToSearch = sourceText.toString();

  const lines = sourceTextToSearch.split(/\r?\n/);

  return lines.reduce((reports, line, lineIndex) => {
    let match;
    let offset = lineIndex == 0 ? firstLineOffset : 0;

    while ((match = dangerousBidiCharsRegexp.exec(line)) !== null) {
      reports.push({ line: lineIndex, column: offset + match.index });
    }

    return reports;
  }, []);
}

function report({ context, node, tokens, message, firstLineOffset }) {
  if (!tokens || !Array.isArray(tokens)) {
    return;
  }
  tokens.forEach((token) => {
    const reports = detectBidiCharacters({ sourceText: token.value, firstLineOffset: token.loc.start.column + firstLineOffset });

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
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-bidi-characters.md',
    },
  },
  create(context) {
    return {
      Program: function (node) {
        report({
          context,
          node,
          tokens: node.tokens,
          firstLineOffset: 0,
          message: "Detected potential trojan source attack with unicode bidi introduced in this code: '{{text}}'.",
        });
        report({
          context,
          node,
          tokens: node.comments,
          firstLineOffset: 2,
          message: "Detected potential trojan source attack with unicode bidi introduced in this comment: '{{text}}'.",
        });
      },
    };
  },
};
