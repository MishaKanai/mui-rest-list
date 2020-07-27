import { createMuiTheme } from "@material-ui/core/styles";
import { pink } from "@material-ui/core/colors";

// A custom theme for this app
export const theme1 = createMuiTheme({
  palette: {},
});

export const theme2 = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: pink["A200"],
      dark: pink["500"],
      light: pink["A100"],
    },
  },
});
