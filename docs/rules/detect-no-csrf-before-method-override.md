# Detects Express "csrf" middleware setup before "method-override" middleware (`security/detect-no-csrf-before-method-override`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

This can allow `GET` requests (which are not checked by `csrf`) to turn into `POST` requests later.

More information: [Bypass Connect CSRF protection by abusing methodOverride Middleware](../bypass-connect-csrf-protection-by-abusing.md)
