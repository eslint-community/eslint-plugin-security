# Detects invisible characters that have no visible glyph and can be used to hide malicious code (`security/detect-invisible-characters`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Detects the presence of invisible characters (characters that have no visible glyph) in source code and comments. Because such characters are rendered as nothing by editors and code review tools, an attacker can use them to hide malicious code that passes human review unnoticed (an "invisible backdoor").

This rule currently detects:

- `U+3164` HANGUL FILLER
- `U+FFA0` HALFWIDTH HANGUL FILLER

Both are valid JavaScript source characters (in strings, comments, and even identifiers) yet display as nothing, making them dangerous.

## Why is this important?

Attacks that rely on visually deceptive or invisible unicode characters have been used to smuggle logic past code review. Unlike [trojan source](https://trojansource.codes/) bidirectional attacks (covered by [`detect-bidi-characters`](./detect-bidi-characters.md)), these characters do not reorder text. They simply render as empty space, so a reviewer sees nothing where a malicious token actually lives.

### An example

In the snippet below the two identifiers look identical, but the second one contains a hidden `U+3164` character between `adm` and `in`. They are therefore two different variables, and the `admin` a reviewer trusts is not the one that ends up being used.

```js
const admin = false;
const admin = true; // the second `admin` actually contains a hidden U+3164 character
```

## Known limitations

- This rule only flags invisible characters that appear literally in the source. A visible escape sequence such as `"\u3164"` is not itself an invisible character in the source text, so it is not reported (and it stays plainly readable during review anyway).
- Because `U+3164` is sometimes used as a blank placeholder in Korean-language content (for example, empty-looking usernames or visual spacing), the rule may report intentional uses in such codebases. The rule cannot distinguish an intentional placeholder from a hidden one.

## Further Reading

- <https://certitude.consulting/blog/en/invisible-backdoor/>
- <https://trojansource.codes/>
