# mui-rest-list

React library for building accessible Material-UI Lists that consume REST apis.

## Versions

| version | MUI | react |
| ------- | --- | ----- |
| 2.x     | `@mui/material` v5 | 17, 18 |
| 1.x     | `@material-ui/core` v4 | 16 |

1.x remains the release line for MUI v4 apps — stay on `^1.0.4` and nothing changes.

Breaking changes in 2.0.0:

- Peer dependencies are `@mui/material` / `@mui/icons-material` (v5). A `renderdata` callback
  on `AdhocListColumn` must return **v5's** `TableCell` — the check is by identity, and the
  new named export `AdhocListTableCell` is the guaranteed-safe way to import exactly the cell
  the library checks against.
- `States.useStyles` is no longer exported (the internal JSS sheet is gone; the components
  render identically via inline styles / `sx`).
- The current-page number button renders `color="inherit"` (v5 removed `"default"`); visually
  identical to 1.x.

## CodeSandbox
https://codesandbox.io/s/mui-rest-list-demo-psk0w

## Storybook
https://mishakanai.github.io/mui-rest-list/?path=/story/
