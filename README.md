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

## CodeSandbox
https://codesandbox.io/s/mui-rest-list-demo-psk0w

## Storybook
https://mishakanai.github.io/mui-rest-list/?path=/story/
