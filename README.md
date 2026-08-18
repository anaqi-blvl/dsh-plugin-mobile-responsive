# dsh-mobile-responsive

A mobile-responsive layout layer for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) web GUI, shipped as a client plugin (`dsh.client`, platform `web`).

## What it fixes

The built-in three-column shell (`@deepseek-ai/dsh-client-ui-layout`) is already partially responsive: below 1024px the sidebar auto-collapses to a 56px rail, and the details panel closes itself when the viewport cannot fit the columns. At phone widths (≤640px) three problems remain, solved here with a pure CSS layer:

| Problem | Fix |
|---|---|
| Expanding the sidebar squishes the conversation to ~110px | The sidebar becomes an overlay drawer (`min(85vw, 340px)`, shadowed, above the full-width conversation) |
| The session stats strip truncates (`white-space: nowrap; overflow: hidden`) | On phones the strip is collapsed to a single line by default — tap it (or Enter) to expand the full stats |
| The composer's model selector overlaps the workspace picker on narrow screens | Below 460px the model label truncates with ellipsis and clears the workspace control |
| The whole page scrolls instead of just the chat (iOS URL-bar resize, rubber-band, pull-to-refresh) | On touch devices the page is pinned (`overflow: hidden`, `100dvh`, `overscroll-behavior: none`) — only the chat area scrolls |
| The composer scrolls away with the chat on iOS | Sticky ancestors switch to `overflow: clip` so WebKit keeps the composer pinned |
| The sidebar drawer leaves a dead gap next to its contents | The sidebar content stretches to fill the drawer |
| Picking a chat from the drawer needs extra taps / the first tap gets swallowed | iOS hover emulation (row action swap + HoverCard preview bubble) is neutralized on touch, so one tap selects; the drawer then auto-collapses (delayed until the switch settles) |
| The settings modal is unusable on phones (188px nav crushes content) | On phones the modal goes full-screen with a horizontal tab strip |
| The question dialog CTA rows overflow | Footer/action rows wrap and share the width |
| The composer sits flush against the bottom edge on notched phones | `env(safe-area-inset-bottom)` padding |

## How it works

Same mechanism as the shipped client plugins: a `dsh.client` package whose browser half injects a `<style data-plugin-css>` tag at materialization. No React, no DOM mutation, no host-side behavior — the host half is a no-op cordis plugin that just makes the entry a valid Loader row.

Selectors prefer stable hooks: the AppFrame's `data-sidebar-collapsed` / `data-details-collapsed` attributes and its first three grid children. One CSS-module-hashed class is referenced (the conversation StatsLine root); if a Harness upgrade changes its hash, that single rule degrades silently while everything else keeps working.

## Install

```sh
dsh plugin --profile web add dsh-mobile-responsive
```

or install from this repository:

```sh
dsh plugin --profile web add git+ssh://git@github.com/anaqi-blvl/dsh-plugin-mobile-responsive.git
```

Then register the plugin in the browser roster — add to your profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: mobile-responsive
      name: 'dsh-mobile-responsive'
```

Restart `dsh web` (new roster entries join `window.__DSH_BOOT__` only at boot), then resize to ≤640px and expand the sidebar to see the drawer.

## Verified against

- Harness client packages `0.1.0-rc.7` (`@deepseek-ai/dsh-client-ui-layout`, `@deepseek-ai/dsh-client-ui-conversation`)
- Headless Chrome (Playwright metrics at 390px / 768px / 1280px; desktop and tablet widths are untouched by the plugin)

## License

MIT
