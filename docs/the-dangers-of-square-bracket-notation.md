# The Dangers of Square Bracket Notation

We are going to be looking at some peculiar and potentially dangerous implications of JavaScript's square bracket notation in this post: where you shouldn't use this style of object access and why, as well how to use it safely when needed.

Square bracket notation for objects in JavaScript provides a very convenient way to dynamically access a specific property or method based on the contents of a variable. The end result of this feature is something that is very similar to Ruby's Mass Assignment: Given an object, you are able to dynamically assign and retrieve properties of this object without specifying this property should be accessible.

_Note: These examples are simple, and seemingly obvious - we will take a look at that later. For now, disregard the practicality of the examples and focus on the dangerous patterns that they reveal._

Let's take a look at why this could be a problem.

### Issue #1: Bracket object notation with user input grants access to every property available on the object.

```js
exampleClass[userInput[1]] = userInput[2];
```

I won't spend much time here, as I believe this is fairly well known. If exampleClass contains a sensitive property, the above code will allow it to be edited.

### Issue #2: Bracket object notation with user input grants access to every property available on the object, **_including prototypes._**

```js
userInput = ['constructor', '{}'];
exampleClass[userInput[1]] = userInput[2];
```

This looks pretty innocuous, even if it is an uncommon pattern. The problem here is that we can access or overwrite prototypes such as `constructor` or `__defineGetter__`, which may be used later on. The most likely outcome of this scenario would be an application crash, when a string is attempted to be called as a function.

### Issue #3: Bracket object notation with user input grants access to every property available on the object, including prototypes, **_which can lead to Remote Code Execution._**

Now here's where things get really dangerous. It's also where example code gets really implausible - bear with me.

```js
var user = function () {
  this.name = 'jon';
  //An empty user constructor.
};

function handler(userInput) {
  var anyVal = 'anyVal'; // This can be any attribute, and does not need to be user controlled.
  user[anyVal] = user[userInput[0]](userInput[1]);
}
```

In the previous section, I mentioned that constructor can be accessed from square brackets. In this case, since we are dealing with a function, the constructor we get back is the `Function` Constructor, which compiles a string of code into a function.

### Exploitation:

In order to exploit the above code, we need a two stage exploit function.

```js
function exploit(cmd) {
  var userInputStageOne = ['constructor', 'require("child_process").exec(arguments[0],console.log)'];
  var userInputStageTwo = ['anyVal', cmd];

  handler(userInputStageOne);
  handler(userInputStageTwo);
}
```

Let's break it down.

The first time handler is run, it looks something like this:

```js
userInput[0] = 'constructor';
userInput[1] = 'require("child_process").exec(arguments[0],console.log)';

user['anyVal'] = user['constructor'](userInput[1]);
```

Executing this code creates a function containing the payload, and assigns it to `user['anyVal']`:

```js
user['anyVal'] = function () {
  require('child_process').exec(arguments[0], console.log);
};
```

And when handler is run a second time:

```js
user.anyVal = user.anyVal('date');
```

What we end up with is this:

![](https://cldup.com/lR_Xp0PwU9.png)

Remote Code Execution. The biggest problem here is that there is very little indication in the code that this is what is going on. With something so serious, method calls tend to be very explicit - eval, child_process, etc. It's pretty difficult in node to accidentally introduce one of those into your application. Here though, without having either deep knowledge of JavaScript builtins or having done previous research, it is very easy to accidentally introduce this into your application.

### Isn't this so obscure that it doesn't matter a whole lot?

Well, yes and no. Is this particular vector a widespread problem? No, because current JavaScript style guides don't advocate programming this way. Might it become a widespread problem in the future? Absolutely. This pattern is avoided because it isn't common, and therefore not learned and taken up as habit, not because it's a known insecure pattern.

Yes, we are talking about some fairly extreme edge cases, but don't make the assumption that your code doesn't have problems because of that - I have seen this issue in production code with some regularity. And, for the majority of node developers, a large portion of application code was not written by them, but rather included through required modules which may contain peculiar flaws like this one.

Edge cases are uncommon, but because they are uncommon the problems with them are not well known, and they frequently go un-noticed during code review. If the code works, these types of problems tend to disappear. If the code works, and the problems are buried in a module nested n-levels deep, it's likely it won't be found until it causes problems, and by then it's too late. A blind require is essentially running untrusted code in your application. Be [aware of what you require.](https://requiresafe.com)

### How do I fix it?

The most direct fix here is going to be to **avoid the use of user input in property name fields**. This isn't reasonable in all circumstances, however, and there should be a way to safely use core language features.

Another option is to create a whitelist of allowed property names, and filter each user input through a helper function to check before allowing it to be used. This is a great option in situations where you know specifically what property names to allow.

In cases where you don't have a strictly defined data model ( which isn't ideal, but there are cases where it has to be so ) then using the same method as above, but with a blacklist of disallowed properties instead is a valid choice.

If you are using the `--harmony` flag or [io.js](https://iojs.org/), you also have the option of using [ECMAScript 6 direct proxies](http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies), which can stand in front of your real object ( private API ) and expose a limited subset of the object ( public API ). This is probably the best approach if you are using this pattern, as it is most consistent with typical object oriented programming paradigms.
