# Detects calls to "buffer" with "noAssert" flag set (`security/detect-buffer-noassert`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Detect calls to [`buffer`](https://nodejs.org/api/buffer.html) with `noAssert` flag set.

From the Node.js API docs: "Setting `noAssert` to true skips validation of the `offset`. This allows the `offset` to be beyond the end of the `Buffer`."
