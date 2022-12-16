# Avoiding Trojan source attacks

Detects cases of [trojan source attacks](https://trojansource.codes) that employ unicode bidi attacks to inject malicious code

## Why is Trojan Source important?

The following publication on the topic of unicode characters attacks, dubbed [Trojan Source: Invisible Vulnerabilities](https://trojansource.codes/trojan-source.pdf), has caused a lot of concern from potential supply chain attacks where adversaries are able to inject malicious code into the source code of a project, slipping by unseen in the code review process.

For more information on the topic, you're welcome to read on the official website [trojansource.codes](https://trojansource.codes/) and the following [source code repository](https://github.com/nickboucher/trojan-source/) which contains the source code of the publication.

### References

- https://certitude.consulting/blog/en/invisible-backdoor/

- https://github.com/lirantal/anti-trojan-source/

- https://github.com/lirantal/eslint-plugin-anti-trojan-source
