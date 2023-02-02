# Changelog

### [1.7.1](https://www.github.com/eslint-community/eslint-plugin-security/compare/v1.7.0...v1.7.1) (2023-02-02)


### Bug Fixes

* false positives for static expressions in detect-non-literal-fs-filename, detect-child-process, detect-non-literal-regexp, and detect-non-literal-require ([#109](https://www.github.com/eslint-community/eslint-plugin-security/issues/109)) ([56102b5](https://www.github.com/eslint-community/eslint-plugin-security/commit/56102b50aed4bd632dd668770eb37de58788110b))

## [1.7.0](https://www.github.com/eslint-community/eslint-plugin-security/compare/v1.6.0...v1.7.0) (2023-01-26)


### Features

* improve detect-child-process rule ([#108](https://www.github.com/eslint-community/eslint-plugin-security/issues/108)) ([64ae529](https://www.github.com/eslint-community/eslint-plugin-security/commit/64ae52944a86f9d9daee769acd63ebbdfc5b6631))

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

## 1.5.0 / 2022-04-14

- Fix avoid crash when exec() is passed no arguments
  Closes [#82](https://github.com/eslint-community/eslint-plugin-security/pull/82) with ref as [#23](https://github.com/eslint-community/eslint-plugin-security/pull/23)
- Fix incorrect method name in detect-buffer-noassert
  Closes [#63](https://github.com/eslint-community/eslint-plugin-security/pull/63) and [#80](https://github.com/eslint-community/eslint-plugin-security/pull/80)
- Clean up source code formatting
  Fixes [#4](https://github.com/eslint-community/eslint-plugin-security/issues/4) and closes [#78](https://github.com/eslint-community/eslint-plugin-security/pull/78)
- Add release script
  [Script](https://github.com/eslint-community/eslint-plugin-security/commit/0a6631ea448eb0031af7b351c85b3aa298c2e44c)
- Add non-literal require TemplateLiteral support [#81](https://github.com/eslint-community/eslint-plugin-security/pull/81)
- Add meta object documentation for all rules [#79](https://github.com/eslint-community/eslint-plugin-security/pull/79)
- Added Git pre-commit hook to format JS files
  [Pre-commit hook](https://github.com/eslint-community/eslint-plugin-security/commit/e2ae2ee9ef214ca6d8f69fbcc438d230fda2bf97)
- Added yarn installation method
- Fix linting errors and step
  [Lint errors](https://github.com/eslint-community/eslint-plugin-security/commit/1258118c2d07722e9fb388a672b287bb43bc73b3), [Lint step](https://github.com/eslint-community/eslint-plugin-security/commit/84f3ed3ab88427753c7ac047d0bccbe557f28aa5)
- Create workflows
  Check commit message on pull requests, Set up ci on main branch
- Update test and lint commands to work cross-platform
  [Commit](https://github.com/eslint-community/eslint-plugin-security/commit/d3d8e7a27894aa3f83b560f530eb49750e9ee19a)
- Merge pull request [#47](https://github.com/eslint-community/eslint-plugin-security/pull/47) from pdehaan/add-docs
  Add old liftsecurity blog posts to docs/ folder
- Bumped up dependencies
- Added `package-lock.json`
- Fixed typos in README and documentation
  Replaced dead links in README

## 1.4.0 / 2017-06-12

- 1.4.0
- Stuff and things for 1.4.0 beep boop 🤖
- Merge pull request [#14](https://github.com/eslint-community/eslint-plugin-security/issues/14) from travi/recommended-example
  Add recommended ruleset to the usage example
- Merge pull request [#19](https://github.com/eslint-community/eslint-plugin-security/issues/19) from pdehaan/add-changelog
  Add basic CHANGELOG.md file
- Merge pull request [#17](https://github.com/eslint-community/eslint-plugin-security/issues/17) from pdehaan/issue-16
  Remove filename from error output
- Add basic CHANGELOG.md file
- Remove filename from error output
- Add recommended ruleset to the usage example
  for [#9](https://github.com/eslint-community/eslint-plugin-security/issues/9)
- Merge pull request [#10](https://github.com/eslint-community/eslint-plugin-security/issues/10) from pdehaan/issue-9
  Add 'plugin:security/recommended' config to plugin
- Merge pull request [#12](https://github.com/eslint-community/eslint-plugin-security/issues/12) from tupaschoal/patch-1
  Fix broken link for detect-object-injection
- Fix broken link for detect-object-injection
  The current link leads to a 404 page, the new one is the proper page.
- Add 'plugin:security/recommended' config to plugin

## 1.3.0 / 2017-02-09

- 1.3.0
- Merge branch 'scottnonnenberg-update-docs'
- Fix merge conflicts because I can't figure out how to accept pr's in the right order
- Merge pull request [#7](https://github.com/eslint-community/eslint-plugin-security/issues/7) from HamletDRC/patch-1
  README.md - documentation detect-new-buffer rule
- Merge pull request [#8](https://github.com/eslint-community/eslint-plugin-security/issues/8) from HamletDRC/patch-2
  README.md - document detect-disable-mustache-escape rule
- Merge pull request [#3](https://github.com/eslint-community/eslint-plugin-security/issues/3) from jesusprubio/master
  A bit of love
- README.md - document detect-disable-mustache-escape rule
- README.md - documentation detect-new-buffer rule
- Merge pull request [#6](https://github.com/eslint-community/eslint-plugin-security/issues/6) from mathieumg/csrf-bug
  Fixed crash with `detect-no-csrf-before-method-override` rule
- Fixed crash with `detect-no-csrf-before-method-override` rule.
- Finishing last commit
- Style guide applied to all the code involving the tests
- Removing a repeated test and style changes
- ESLint added to the workflow
- Removed not needed variables
- Fix to a problem with a rule detected implementing the tests
- Test engine with tests for all the rules
- Minor typos
- A little bit of massage to readme intro
- Add additional information to README for each rule

## 1.2.0 / 2016-01-21

- 1.2.0
- updated to check for new RegExp too

## 1.1.0 / 2016-01-06

- 1.1.0
- adding eslint rule to detect new buffer hotspot

## 1.0.0 / 2015-11-15

- updated desc
- rules disabled by default
- update links
- beep boop
