import makeAdhocList from "../components/makeAdhocList";
// @ts-ignore
import { withKnobs, object } from "@storybook/addon-knobs/react";
import { StarWarsCharacterList } from "./PaginatedStarWarsList";
import { ColorList } from "./UnpaginatedList";
import { withInfo } from "@storybook/addon-info";
import { withA11y } from "@storybook/addon-a11y";

const { AdhocList: _AdhocList } = makeAdhocList<any>();

export default {
  title: "Adhoc Lists",
  component: _AdhocList,
  decorators: [withKnobs, withInfo, withA11y],
};

export { StarWarsCharacterList, ColorList };
