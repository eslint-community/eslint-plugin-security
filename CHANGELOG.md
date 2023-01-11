# Changelog

## [1.6.0](https://www.github.com/eslint-community/eslint-plugin-security/compare/v1.5.0...v1.6.0) (2023-01-11)


### Features

* Add meta object documentation for all rules ([#79](https://www.github.com/eslint-community/eslint-plugin-security/issues/79)) ([fb1d9ef](https://www.github.com/eslint-community/eslint-plugin-security/commit/fb1d9ef56e0cf2705b9e413b483261df394c45e1))
* detect-bidi-characters rule ([#95](https://www.github.com/eslint-community/eslint-plugin-security/issues/95)) ([4294d29](https://www.github.com/eslint-community/eslint-plugin-security/commit/4294d29cca8af5c627de759919add6dd698644ba))
* **detect-non-literal-fs-filename:** change to track non-top-level `require()` as well ([#105](https://www.github.com/eslint-community/eslint-plugin-security/issues/105)) ([d3b1543](https://www.github.com/eslint-community/eslint-plugin-security/commit/d3b15435b45b9ac2ee5f0d3249f590e32369d7d2))
* extend detect non literal fs filename ([#92](https://www.github.com/eslint-community/eslint-plugin-security/issues/92)) ([08ba476](https://www.github.com/eslint-community/eslint-plugin-security/commit/08ba4764a83761f6f44cb28940923f1d25f88581))
* **non-literal-require:** support template literals ([#81](https://www.github.com/eslint-community/eslint-plugin-security/issues/81)) ([208019b](https://www.github.com/eslint-community/eslint-plugin-security/commit/208019bad4f70a142ab1f0ea7238c37cb70d1a5a))


### Bug Fixes

* Avoid crash when exec() is passed no arguments ([7f97815](https://www.github.com/eslint-community/eslint-plugin-security/commit/7f97815accf6bcd87de73c32a967946b1b3b0530)), closes [#82](https://www.github.com/eslint-community/eslint-plugin-security/issues/82) [#23](https://www.github.com/eslint-community/eslint-plugin-security/issues/23)
* Avoid TypeError when exec stub is used with no arguments ([#97](https://www.github.com/eslint-community/eslint-plugin-security/issues/97)) ([9c18f16](https://www.github.com/eslint-community/eslint-plugin-security/commit/9c18f16187719b58cc5dfde9860344bad823db28))
* **detect-child-process:** false positive for destructuring with `exec` ([#102](https://www.github.com/eslint-community/eslint-plugin-security/issues/102)) ([657921a](https://www.github.com/eslint-community/eslint-plugin-security/commit/657921a93f6f73c0de6113e497b22e7cf079f520))
* **detect-child-process:** false positives for destructuring `spawn` ([#103](https://www.github.com/eslint-community/eslint-plugin-security/issues/103)) ([fdfe37d](https://www.github.com/eslint-community/eslint-plugin-security/commit/fdfe37d667367e5fd228c26573a1791c81a044d2))
* Incorrect method name in detect-buffer-noassert. ([313c0c6](https://www.github.com/eslint-community/eslint-plugin-security/commit/313c0c693f48aa85d0c9b65a46f6c620cd10f907)), closes [#63](https://www.github.com/eslint-community/eslint-plugin-security/issues/63) [#80](https://www.github.com/eslint-community/eslint-plugin-security/issues/80)
