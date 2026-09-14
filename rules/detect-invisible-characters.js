/**
 * Detect invisible characters that can be used to hide malicious code from reviewers
 * @author electrohyun
 */

'use strict';

const invisibleCharsRegexp = /[\u3164\uFFA0]/gu;

/**
 * Detects all the invisible characters in a given source text
 *
 * @param {object} options - Options
 * @param {string} options.sourceText - The source text to search for invisible characters
 * @param {number} options.firstLineOffset - The offset of the first line in the source text
 * @returns {Array<{line: number, column: number}>} - An array of reports, each report is an
 *    object with the line and column of the invisible character
 */
function detectInvisibleCharacters({ sourceText, firstLineOffset }) {
  const sourceTextToSearch = sourceText.toString();

  const lines = sourceTextToSearch.split(/\r\n|[\r\n\u2028\u2029]/);

  return lines.reduce((reports, line, lineIndex) => {
    let match;
    let offset = lineIndex == 0 ? firstLineOffset : 0;

    while ((match = invisibleCharsRegexp.exec(line)) !== null) {
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
    const reports = detectInvisibleCharacters({ sourceText: token.value, firstLineOffset: token.loc.start.column + firstLineOffset });

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
      description: 'Detects invisible characters that have no visible glyph and can be used to hide malicious code.',
      category: 'Possible Security Vulnerability',
      recommended: true,
      url: 'https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-invisible-characters.md',
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
          message: "Detected an invisible character introduced in this code: '{{text}}'.",
        });
        report({
          context,
          node,
          tokens: node.comments,
          firstLineOffset: 2,
          message: "Detected an invisible character introduced in this comment: '{{text}}'.",
        });
      },
    };
  },
};
