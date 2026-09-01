# mui-rest-list

React library for building accessible Material-UI Lists that consume REST apis.

## Versions

| version | MUI | react |
| ------- | --- | ----- |
| 3.x     | `@mui/material` v6, v7 | 17, 18 |
| 2.x     | `@mui/material` v5 | 17, 18 |
| 1.x     | `@material-ui/core` v4 | 16 |

Each line stays available: stay on `^2.0.0` for MUI v5 apps, `^1.0.4` for MUI v4 apps, and
nothing changes.

Breaking changes in 3.0.0:

- Peer dependencies are `@mui/material` / `@mui/icons-material` **v6 or v7**. v5 is dropped:
  the pagination controls now pass their accessibility props through `slots` / `slotProps`,
  which v5's `TablePagination` does not have — on v5 they would be silently ignored.
- A `renderdata` callback on `AdhocListColumn` must return the `TableCell` of *that* major.
  The check is by identity, and the named export `AdhocListTableCell` is the guaranteed-safe
  way to import exactly the cell the library checks against.

No source change is needed to move a v5 app from 2.x to 3.x — the exported components, their
props, and the `lib/src/...` module layout are unchanged. Only the peer majors move.

Breaking changes in 2.0.0:

- Peer dependencies are `@mui/material` / `@mui/icons-material` (v5).
- `States.useStyles` is no longer exported (the internal JSS sheet is gone; the components
  render identically via inline styles / `sx`).
- The current-page number button renders `color="inherit"` (v5 removed `"default"`); visually
  identical to 1.x.

## Packaging (3.1.0)

3.1.0 ships an ES module build in `lib-esm/` alongside the CommonJS build in `lib/`, selected by
an `exports` map. This is not cosmetic — on 3.0.0, which was CommonJS only, MUI v7 handed the
library and the app two different `TableCell` functions:

- MUI v7 added an `exports` map that serves a different build per condition — `require` resolves
  to `@mui/material/<X>/index.js`, everything else to `esm/<X>/index.js`.
- A CommonJS `mui-rest-list` therefore held MUI's CJS cell while an ESM app held the ESM cell.
- `AdhocListColumn`'s `renderdata` check compares the returned cell by identity, so a callback
  returning `AdhocListTableCell` threw at render.

MUI v5 had no `exports` map, so both paths collapsed onto one file and the problem could not
arise; it is specific to v6/v7.

An `exports` map is a whitelist. The supported entry points are:

| specifier | resolves to |
| --------- | ----------- |
| `mui-rest-list` | the package entry |
| `mui-rest-list/lib/<path>` and `mui-rest-list/lib/<path>.js` | that module |
| `mui-rest-list/lib/src/components`, `.../Pagination`, `.../states` | those directories' `index` |

Types always come from `lib/` and still resolve under `moduleResolution: "node"`. If you add a
new directory with an `index` file and expect consumers to deep-import it without `/index`, add
it to `exports` explicitly — wildcards do not perform directory resolution.

## CodeSandbox
https://codesandbox.io/s/mui-rest-list-demo-psk0w

## Storybook
https://mishakanai.github.io/mui-rest-list/?path=/story/
