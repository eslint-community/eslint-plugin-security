# Bypass Connect CSRF protection by abusing methodOverride Middleware

Since our platform isn't setup for advisories that are not specific to a particular module version, but rather a use / configuration of a certain module, we will announce this issue here and get it into the database at a later date.

This issue was found and reported to us by [Luca Carettoni](http://twitter.com/_ikki) (who we consider one of the node security projects core advisers in many areas)

## Affected Component

Connect, methodOverride middleware

### Description:

**Connect's "methodOverride" middleware allows an HTTP request to override the method of the request with the value of the "\_method" post key or with the header "x-http-method-override".**

As the declaration order of middlewares determines the execution stack in Connect, it is possible to abuse this functionality in order to bypass the standard Connect's anti-CSRF protection.

Considering the following code:

```js
...
app.use express.csrf()
...
app.use express.methodOverride()
```

Connect's CSRF middleware does not check csrf tokens in case of idempotent verbs (GET/HEAD/OPTIONS, see lib/middleware/csrf.js). As a result, it is possible to bypass this security control by sending a GET request with a POST MethodOverride header or key.

### Example:

```sh
GET / HTTP/1.1
[..]
_method=POST
```

### Mitigation Factors:

Disable methodOverride or make sure that it takes precedence over other middleware declarations.

Thanks to the same origin policy enforced by modern browsers in XMLHttpRequest and other mechanisms, the exploitability of this issue abusing "x-http-method-override" header is significantly reduced.

There is also an [ESLint plugin](https://github.com/evilpacket/eslint-rules) that you can use to help identify this.
