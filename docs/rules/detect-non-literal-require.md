# Detects "require(variable)", which might allow an attacker to load and run arbitrary code, or access arbitrary files on disk (`security/detect-non-literal-require`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

More information: [Where does Node.js and require look for modules?](http://www.bennadel.com/blog/2169-where-does-node-js-and-require-look-for-modules.htm)
