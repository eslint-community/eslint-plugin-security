module.exports = function (context) {

    var getSource = function (node) {
        var token = context.getTokens(node)[0];
        return token.loc.start.line+ ':  ' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t');
    }


    // Detects instances of new Buffer(argument)
    // where argument is any non literal value.
    return {
      "NewExpression": function (node) {
        if (node.callee.name === 'Buffer' &&
          node.arguments[0] &&
          node.arguments[0].type != 'Literal') {

          return context.report(node, "Found new Buffer\n\t" + getSource(node));
        }



      }
    };

}

