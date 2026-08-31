import { createTheme } from "@mui/material/styles";
import { pink } from "@mui/material/colors";

// A custom theme for this app
export const theme1 = createTheme({
  palette: {},
});

export const theme2 = createTheme({
  palette: {
    // v5 renamed palette.type to mode
    mode: "dark",
    primary: {
      main: pink["A200"],
      dark: pink["500"],
      light: pink["A100"],
    },
  },
});
