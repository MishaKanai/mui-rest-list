import React from "react";
import makeAdhocList from "../components/makeAdhocList";
// @ts-ignore
import { withKnobs, object } from "@storybook/addon-knobs/react";
import { StarWarsCharacterList } from "./PaginatedStarWarsList";
import { ColorList } from "./UnpaginatedList";
import { withInfo } from "@storybook/addon-info";
import { withA11y } from "@storybook/addon-a11y";
// @ts-ignore
import { withThemes } from "@react-theming/storybook-addon";

import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { theme1, theme2 } from "./themes";

const providerFn = ({ theme, children }: any) => {
  const serialTheme = JSON.parse(JSON.stringify(theme));
  const muTheme = createMuiTheme(serialTheme);
  return <ThemeProvider theme={muTheme}>{children}</ThemeProvider>;
};

const { AdhocList: _AdhocList } = makeAdhocList<any>();

export default {
  title: "Adhoc Lists",
  component: _AdhocList,
  decorators: [
    withKnobs,
    withInfo,
    withA11y,
    withThemes(null, [theme1, theme2], { providerFn }),
  ],
};

export { StarWarsCharacterList, ColorList };
