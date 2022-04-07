# Avoiding Command Injection in Node.js

In this post we are going to learn about the proper way to call a system command using node.js to avoid a common security flaw, command injection.

A call that we often see used, due to it's simplicity is `child_process.exec`. It's got a simple pattern; pass in a command string and it calls you back with an error or the command results.

Here is a very typical way you would call a system command with `child_process.exec.`

```js
child_process.exec('ls', function (err, data) {
  console.log(data);
});
```

What happens though when you need to start getting user input for arguments into your command? The obvious solution is to take the user input and build your command out using string concatenation. But here's something I've learned over the years: When you use string concatenation to send data from one system to another you're probably going to have a bad day.

```js
var path = 'user input';
child_process.exec('ls -l ' + path, function (err, data) {
  console.log(data);
});
```

## Why is string concatenation a problem?

Well, because under the hood, `child_process.exec` makes a call to execute <kbd>/bin/sh</kbd> rather than the target program. The command that was sent just gets passed along as a shell command in the newly spawned <kbd>/bin/sh</kbd> process. `child_process.exec` has a misleading name - it's a bash interpreter, not a program launcher. And that means that all shell metacharacters can have devastating effects if the command is including user input.

```sh
[pid 25170] execve("/bin/sh", ["/bin/sh", "-c", "ls -l user input"], [/* 16 vars */]
```

For example, an attacker could use a ; to end the statement and start another one, they could use backticks or $() to run a subcommand. Lots of potential for abuse.

## So how do we do this the right way?

Calls like `spawn` and `execFile` take additional command arguments as an array, are not executed under a shell environment, and do not manipulate the originally intended command to run.

Let's modify our example to use `execFile` and `spawn` and see how the system calls differ, and why it isn't vulnerable to command injection.

### `child_process.execFile`

```js
var child_process = require('child_process');

var path = '.';
child_process.execFile('/bin/ls', ['-l', path], function (err, result) {
  console.log(result);
});
```

System call that is run

```sh
[pid 25565] execve("/bin/ls", ["/bin/ls", "-l", "."], [/* 16 vars */]
```

### `child_process.spawn`

Similar example using `spawn` instead.

```js
var child_process = require('child_process');

var path = '.';
var ls = child_process.spawn('/bin/ls', ['-l', path]);
ls.stdout.on('data', function (data) {
  console.log(data.toString());
});
```

System call that is run

```sh
[pid 26883] execve("/bin/ls", ["/bin/ls", "-l", "."], [/* 16 vars */
```

When using `spawn` or `execFile`, our target program is the first argument to execve. This means that a user cannot run subcommands in the shell, because <kbd>/bin/ls</kbd> has no idea what to do with backticks or pipes or ;. It's <kbd>/bin/bash</kbd> that is going to be interpreting those commands. It's similar to using parameterized vs string-based SQL queries, if you are familiar with that.

This does however come with a caveat: using `spawn` or `execFile` is not always a safe thing. For example, running <kbd>/bin/find</kbd> with `spawn` or `execFile` and passing user input in directly could still lead to complete system takeover. The <kbd>find</kbd> command has options that allow for arbitrary file read/write.

So, here's the collective guidance for running system commands from node.js:

- Avoid using `child_process.exec`, and never use it if the command contains any input that changes based on user input.
- Try to avoid letting users pass in options to commands if possible. Typically values are okay when using spawn or execfile, but selecting options via a user controlled string is a bad idea.
- If you must allow for user controlled options, look at the options for the command extensively, determine which options are safe, and whitelist only those options.
