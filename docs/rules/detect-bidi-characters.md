# Detects trojan source attacks that employ unicode bidi attacks to inject malicious code (`security/detect-bidi-characters`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Detects cases of [trojan source attacks](https://trojansource.codes) that employ unicode bidi attacks to inject malicious code

## Why is Trojan Source important?

The following publication on the topic of unicode characters attacks, dubbed [Trojan Source: Invisible Vulnerabilities](https://trojansource.codes/trojan-source.pdf), has caused a lot of concern from potential supply chain attacks where adversaries are able to inject malicious code into the source code of a project, slipping by unseen in the code review process.

### An example

As an example, take the following code where `RLO`, `LRI`, `PDI`, `IRI` are placeholders to visualise the respective dangerous unicode characters:

```js
#!/usr/bin/env node

var accessLevel = 'user';

if (accessLevel != 'userRLO LRI// Check if adminPDI IRI') {
  console.log('You are an admin.');
}
```

The code above, will be rendered by a text editor as follows:

```js
#!/usr/bin/env node

var accessLevel = 'user';

if (accessLevel != 'user') {
  // Check if admin
  console.log('You are an admin.');
}
```

By looking at the rendered code above, a user reviewing this code might not notice the injected malicious unicode characters which are actually changing the semantic and the behaviour of the actual code.

### More information

For more information on the topic, you're welcome to read on the official website [trojansource.codes](https://trojansource.codes/) and the following [source code repository](https://github.com/nickboucher/trojan-source/) which contains the source code of the publication.

### References

- <https://certitude.consulting/blog/en/invisible-backdoor/>
- <https://github.com/lirantal/anti-trojan-source/>
- <https://github.com/lirantal/eslint-plugin-anti-trojan-source>
