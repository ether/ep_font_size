# Agent Guide — ep_font_size

Apply sizes to fonts.

## Tech stack

* Etherpad plugin framework (hooks declared in `ep.json`)
* EJS templates rendered server-side via `eejsBlock_*` hooks
* html10n for i18n (`locales/<lang>.json`, `data-l10n-id` in templates)
* `ep_plugin_helpers` for shared boilerplate

## Project structure

```
ep_font_size/
├── AGENTS.md
├── CONTRIBUTING.md
├── ep.json
├── exportHTML.js
├── index.js
├── locales/
│   ├── ar.json
│   ├── be-tarask.json
│   ├── bn.json
│   ├── ca.json
│   ├── cnr-latn.json
│   ├── cs.json
│   └── ...
├── package.json
├── static/
│   ├── css/
│   ├── img/
│   ├── js/
│   ├── tests/
├── templates/
│   ├── editbarButtons.ejs
│   ├── fileMenu.ejs
```

## Helpers used

* `attributes` from `ep_plugin_helpers`
* `attributes-server` from `ep_plugin_helpers`
* `rawHTML` from `ep_plugin_helpers`
* `template` from `ep_plugin_helpers`


## Helpers NOT used

_To be audited in the helpers-adoption sweep (Phase 4)._


## Running tests locally

`ep_font_size` runs inside Etherpad's test harness. From an etherpad checkout that has installed this plugin via `pnpm run plugins i --path ../ep_font_size`:

```bash
# Backend (Mocha) — harness boots its own server
pnpm --filter ep_etherpad-lite run test

# Playwright — needs `pnpm run dev` in a second terminal
pnpm --filter ep_etherpad-lite run test-ui
```

## Standing rules for agent edits

* PRs target `main`. Linear commits, no merge commits.
* Every bug fix includes a regression test in the same commit.
* All user-facing strings in `locales/`. No hardcoded English in templates.
* No hardcoded `aria-label` on icon-only controls — etherpad's html10n auto-populates `aria-label` from the localized string when (a) the element has a `data-l10n-id` and (b) no author-supplied `aria-label` is present. Adding a hardcoded English `aria-label` blocks that and leaves it untranslated. (See `etherpad-lite/src/static/js/vendors/html10n.ts:665-678`.)
* No nested interactive elements (no `<button>` inside `<a>`).
* LLM/Agent contributions are explicitly welcomed by maintainers.

## Quick reference: hooks declared in `ep.json`

* Server: `padInitToolbar`, `eejsBlock_editbarMenuLeft`, `collectContentPre`, `exportHtmlAdditionalTagsWithData`, `stylesForExport`, `getLineHTMLForExport`, `eejsBlock_dd_format`
* Client: `postAceInit`, `postToolbarInit`, `aceInitialized`, `aceEditorCSS`, `aceCreateDomLine`, `aceAttribsToClasses`, `collectContentPre`

When adding a hook, register it in both `ep.json` *and* the matching `exports.<hook> = ...` in the JS file.
