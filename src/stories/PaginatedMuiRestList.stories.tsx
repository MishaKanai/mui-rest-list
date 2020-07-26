import makeAdhocList from "../components/makeAdhocList";
// @ts-ignore
import { withKnobs, object } from "@storybook/addon-knobs/react";
import { StarWarsCharacterList } from "./PaginatedStarWarsList";
import { ColorList } from "./UnpaginatedList";
const { AdhocList: _AdhocList } = makeAdhocList<any>();

export default {
  title: "Adhoc Lists",
  component: _AdhocList,
  decorators: [withKnobs],
};

export { StarWarsCharacterList, ColorList };
