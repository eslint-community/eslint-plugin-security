# Regular Expression DoS and Node.js

Imagine you are trying to buy a ticket to your favorite JavaScript conference, and instead of getting the ticket page, you instead get `500 Internal Server Error`. For some reason the site is down. You can't do the thing that you want to do most and the conference is losing out on your purchase, all because the application is unavailable.

Availability is not often treated as a security problem, which it is, and its impacts are immediate, and deeply felt.

The attack surface for Node.js in regards to loss of availability is quite large, as we are dealing with a single event loop. If an attacker can control and block that event loop, then nothing else gets done.

There are many ways to block the event loop, one way an attacker can do that is with [Regular Expression Denial of Service (ReDoS)](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS).

If user provided input finds its way into a regular expression, or a regular expression is designed with certain attributes, such as grouping with repetition, you can find yourself in a vulnerable position, as the regular expression match could take a long time to process. [OWASP](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS) has a deeper explanation of why this occurs.

Let's look at an vulnerable example. Below we are attempting the common task of validating an email address on the server.

```js
validateEmailFormat: function( string ) {
  var emailExpression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  return emailExpression.test( string );
}
```

With the example above, we can use this test script to show how bad input can impact server responsiveness:

```js
start = process.hrtime();
console.log(validateEmailFormat('baldwin@andyet.net'));
console.log(process.hrtime(start));

start = process.hrtime();
console.log(validateEmailFormat('jjjjjjjjjjjjjjjjjjjjjjjjjjjj@ccccccccccccccccccccccccccccc.5555555555555555555555555555555555555555{'));
console.log(process.hrtime(start));

start = process.hrtime();
console.log(validateEmailFormat('jjjjjjjjjjjjjjjjjjjjjjjjjjjj@ccccccccccccccccccccccccccccc.55555555555555555555555555555555555555555{'));
console.log(process.hrtime(start));

start = process.hrtime();
console.log(validateEmailFormat('jjjjjjjjjjjjjjjjjjjjjjjjjjjj@ccccccccccccccccccccccccccccc.555555555555555555555555555555555555555555555555555555{'));
console.log(process.hrtime(start));
```

Here are the results of running that script:

```sh
true
[ 0, 9694442 ]  <- Match on good data takes little time
false
[ 0, 49849962 ]  <- Initial bad input baseline
false
[ 0, 55123953 ] <- Added 1 character to the input and you see minimal spike
false
[ 8, 487126563 ] <- Added 12 characters and you see it bumps up significantly
```

One way you can check regular expressions for badness in an automated way is by using a module from [substack](https://twitter.com/substack) called [safe-regex](https://www.npmjs.org/package/safe-regex). It's prone to false positives, however, it can be useful to point to potentially vulnerable regular expressions you would have otherwise missed in your code.

Here is a rule for eslint that you can use to test your JavaScript regular expressions:

```js
var safe = require('safe-regex');
module.exports = function (context) {
  'use strict';

  return {
    Literal: function (node) {
      var token = context.getTokens(node)[0],
        nodeType = token.type,
        nodeValue = token.value;

      if (nodeType === 'RegularExpression') {
        if (!safe(nodeValue)) {
          context.report(node, 'Possible Unsafe Regular Expression');
        }
      }
    },
  };
};
```

Additionally, OWASP has a [list of regular expressions](https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository) for common validations that might be useful to you.

As part of our ongoing effort to increase the overall security of the Node.js ecosystem, we have conducted automated analysis of every module on npm. We did identify 56 unique vulnerable regular expressions and over 120 modules containing vulnerable regular expressions. Considering that there are now over 100k modules, the results were not alarming. We're working closely with the maintainers of each module to get the issues resolved, once that's done, advisories will be published to the [npm Security advisories](https://www.npmjs.com/advisories) site.
