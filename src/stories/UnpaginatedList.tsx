import React from "react";
import makeAdhocList, { GetObservableParams, Order } from "../components/makeAdhocList";
import { of } from "rxjs";
import { delay, map } from "rxjs/operators";
// @ts-ignore
import { withKnobs, object } from "@storybook/addon-knobs/react";
import { TableCell, Card } from "@material-ui/core";
import orderBy from 'lodash/orderBy';

type ColorData = {
  color: string;
  category: "hue" | "value";
  type?: "primary" | "secondary";
  code: {
    rgba: [number, number, number, number];
    hex: string;
  };
};

const { AdhocList, AdhocListColumn } = makeAdhocList<ColorData>();

export default {
  title: "AdhocList",
  component: AdhocList,
  decorators: [withKnobs],
};

const getDataObservable = (params: any) =>
  of<ColorData[]>([
    {
      color: "black",
      category: "hue",
      type: "primary",
      code: {
        rgba: [255, 255, 255, 1],
        hex: "#000",
      },
    },
    {
      color: "white",
      category: "value",
      code: {
        rgba: [0, 0, 0, 1],
        hex: "#FFF",
      },
    },
    {
      color: "red",
      category: "hue",
      type: "primary",
      code: {
        rgba: [255, 0, 0, 1],
        hex: "#FF0",
      },
    },
    {
      color: "blue",
      category: "hue",
      type: "primary",
      code: {
        rgba: [0, 0, 255, 1],
        hex: "#00F",
      },
    },
    {
      color: "yellow",
      category: "hue",
      type: "primary",
      code: {
        rgba: [255, 255, 0, 1],
        hex: "#FF0",
      },
    },
    {
      color: "green",
      category: "hue",
      type: "secondary",
      code: {
        rgba: [0, 255, 0, 1],
        hex: "#0F0",
      },
    },
  ]).pipe(
    map(list => {
      if (!params?.orderBy) {
        return list;
      }
      const [field, dir] = params.orderBy;
      return orderBy(list, field, dir) as ColorData[]
    }),
    delay(1200)
  );

export const ColorList = () => {
  return (
    <Card style={{ margin: "1em", padding: "1em" }}>
      <AdhocList
        type="unpaginated"
        titleOptions={object("titleOptions", {
          type: "Typography",
          TypographyProps: {
            variant: "h4",
          },
          text: "Colors",
        })}
        hasRefresh={object("hasRefresh", true)}
        getDataObservable={getDataObservable}
        tableCaption="Colors"
      >
        <AdhocListColumn title="color" fieldKey="color" />
        <AdhocListColumn sortable initialSort="desc" title="category" fieldKey="category" />
        <AdhocListColumn sortable title="type" fieldKey="type" />
        <AdhocListColumn sortable title="Hex" fieldKey={["code", "hex"]} />
        <AdhocListColumn
          title="ColorExample"
          hideColTitle
          fieldKey={["code", "hex"]}
          renderdata={(hexCode: string) => {
            return (
              <TableCell>
                <div
                  style={{
                    backgroundColor: hexCode,
                    height: "2em",
                    width: "2em",
                  }}
                />
              </TableCell>
            );
          }}
        />
      </AdhocList>
    </Card>
  );
};
