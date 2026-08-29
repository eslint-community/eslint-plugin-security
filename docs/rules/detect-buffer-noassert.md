# Detects calls to "buffer" with "noAssert" flag set (`security/detect-buffer-noassert`)

❌ This rule is deprecated.

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

**Deprecated:** The `noAssert` option was removed from the Node.js `Buffer` API in [Node.js #18395](https://github.com/nodejs/node/pull/18395). This rule is no longer necessary but is kept for backwards compatibility.

Detect calls to [`buffer`](https://nodejs.org/api/buffer.html) with `noAssert` flag set.

From the Node.js API docs: "Setting `noAssert` to true skips validation of the `offset`. This allows the `offset` to be beyond the end of the `Buffer`."
