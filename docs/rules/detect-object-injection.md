# Detects "variable[key]" as a left- or right-hand assignment operand (`security/detect-object-injection`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

JavaScript allows you to use expressions to access object properties in addition to using dot notation. So instead of writing this:

```js
object.name = 'foo';
```

You can write this:

```js
object['name'] = 'foo';
```

Square bracket notation allows any expression to be used in place of an identifier, so you can also do this:

```js
const key = 'name';
object[key] = 'foo';
```

By doing so, you've now obfuscated the property name from the reader, which makes it easy for a malicious actor to replace the value of `key` and change the behavior of the code.

This rule flags any expression in the form of `object[expression]` no matter where it occurs. Examples of patterns this will be flagged are:

```js
object[key] = value;

value = object[key];

doSomething(object[key]);
```

More information: [The Dangers of Square Bracket Notation](../the-dangers-of-square-bracket-notation.md)
