# 1.5.0 / 2022-04-14

- 1.5.0
- Fix avoid crash when exec() is passed no arguments
  Closes [#82](https://github.com/nodesecurity/eslint-plugin-security/pull/82) with ref as [#23](https://github.com/nodesecurity/eslint-plugin-security/pull/23)
- Fix incorrect method name in detect-buffer-noassert
  Closes [#63](https://github.com/nodesecurity/eslint-plugin-security/pull/63) and [#80](https://github.com/nodesecurity/eslint-plugin-security/pull/80)
- Clean up source code formatting
  Fixes [#4](https://github.com/nodesecurity/eslint-plugin-security/issues/4) and closes [#78](https://github.com/nodesecurity/eslint-plugin-security/pull/78)
- Add release script
  [Script](https://github.com/nodesecurity/eslint-plugin-security/commit/0a6631ea448eb0031af7b351c85b3aa298c2e44c)
- Add non-literal require TemplateLiteral support [#81](https://github.com/nodesecurity/eslint-plugin-security/pull/81)
- Add meta object documentation for all rules [#79](https://github.com/nodesecurity/eslint-plugin-security/pull/79)
- Added Git pre-commit hook to format JS files
  [Pre-commit hook](https://github.com/nodesecurity/eslint-plugin-security/commit/e2ae2ee9ef214ca6d8f69fbcc438d230fda2bf97)
- Added yarn installation method
- Fix linting errors and step
  [Lint errors](https://github.com/nodesecurity/eslint-plugin-security/commit/1258118c2d07722e9fb388a672b287bb43bc73b3), [Lint step](https://github.com/nodesecurity/eslint-plugin-security/commit/84f3ed3ab88427753c7ac047d0bccbe557f28aa5)
- Create workflows
  Check commit message on pull requests, Set up ci on main branch
- Update test and lint commands to work cross-platform
  [Commit](https://github.com/nodesecurity/eslint-plugin-security/commit/d3d8e7a27894aa3f83b560f530eb49750e9ee19a)
- Merge pull request [#47](https://github.com/nodesecurity/eslint-plugin-security/pull/47) from pdehaan/add-docs
  Add old liftsecurity blog posts to docs/ folder
- Bumped up dependencies
- Added `package-lock.json`
- Fixed typos in README and documentation
  Replaced dead links in README

# 1.4.0 / 2017-06-12

- 1.4.0
- Stuff and things for 1.4.0 beep boop 🤖
- Merge pull request [#14](https://github.com/nodesecurity/eslint-plugin-security/issues/14) from travi/recommended-example
  Add recommended ruleset to the usage example
- Merge pull request [#19](https://github.com/nodesecurity/eslint-plugin-security/issues/19) from pdehaan/add-changelog
  Add basic CHANGELOG.md file
- Merge pull request [#17](https://github.com/nodesecurity/eslint-plugin-security/issues/17) from pdehaan/issue-16
  Remove filename from error output
- Add basic CHANGELOG.md file
- Remove filename from error output
- Add recommended ruleset to the usage example
  for [#9](https://github.com/nodesecurity/eslint-plugin-security/issues/9)
- Merge pull request [#10](https://github.com/nodesecurity/eslint-plugin-security/issues/10) from pdehaan/issue-9
  Add 'plugin:security/recommended' config to plugin
- Merge pull request [#12](https://github.com/nodesecurity/eslint-plugin-security/issues/12) from tupaschoal/patch-1
  Fix broken link for detect-object-injection
- Fix broken link for detect-object-injection
  The current link leads to a 404 page, the new one is the proper page.
- Add 'plugin:security/recommended' config to plugin

# 1.3.0 / 2017-02-09

- 1.3.0
- Merge branch 'scottnonnenberg-update-docs'
- Fix merge conflicts because I can't figure out how to accept pr's in the right order
- Merge pull request [#7](https://github.com/nodesecurity/eslint-plugin-security/issues/7) from HamletDRC/patch-1
  README.md - documentation detect-new-buffer rule
- Merge pull request [#8](https://github.com/nodesecurity/eslint-plugin-security/issues/8) from HamletDRC/patch-2
  README.md - document detect-disable-mustache-escape rule
- Merge pull request [#3](https://github.com/nodesecurity/eslint-plugin-security/issues/3) from jesusprubio/master
  A bit of love
- README.md - document detect-disable-mustache-escape rule
- README.md - documentation detect-new-buffer rule
- Merge pull request [#6](https://github.com/nodesecurity/eslint-plugin-security/issues/6) from mathieumg/csrf-bug
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

# 1.2.0 / 2016-01-21

- 1.2.0
- updated to check for new RegExp too

# 1.1.0 / 2016-01-06

- 1.1.0
- adding eslint rule to detect new buffer hotspot

# 1.0.0 / 2015-11-15

- updated desc
- rules disabled by default
- update links
- beep boop
