/*
  The header-cell style question that no jsdom test can answer.

  AdhocList renders its header cells as <TableCell padding="none" sx={{ ..., paddingLeft: '1em' }}>.
  That only produces the intended 1em indent if emotion injects the sx rule *after* the
  component's own `padding: 0` rule. Nothing about that is visible without a layout engine, and
  the ordering is exactly the sort of thing a MUI major can change.

  So: render it, read getComputedStyle off the real nodes, and print the numbers. Compare the
  printed values between the 2.x and 3.x Storybooks — a regression here shows up as a different
  padding-left, not as a subtly wrong-looking table.
*/
import React, { useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import makeAdhocList from "../components/makeAdhocList";
import { Person, unpaginatedPeople } from "./fixtures";
import { ComputedStyleProbe, StoryFrame, ThemeProbe } from "./harness";

export default { title: "Fixtures/HeaderCell" };

const { AdhocList, AdhocListColumn } = makeAdhocList<Person>();

const boxProperties = [
  "padding-left",
  "padding-right",
  "padding-top",
  "padding-bottom",
  "font-size",
  "line-height",
];

export const HeaderCellPadding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <StoryFrame
      title="AdhocList header cells — sx paddingLeft vs the cell's own padding='none'"
      note="Expected: padding-left resolves to the sx value (1em of the cell's own font-size), not to 0. The other three sides stay at 0 from padding='none'."
    >
      <div ref={containerRef}>
        <AdhocList
          type="unpaginated"
          tableCaption="People"
          titleOptions={{ type: "aria-label", text: "People" }}
          getDataObservable={unpaginatedPeople}
        >
          <AdhocListColumn title="Name" fieldKey="name" sortable />
          <AdhocListColumn title="Role" fieldKey="role" sortable />
          <AdhocListColumn title="Department" fieldKey="department" />
        </AdhocList>
      </div>
      <ComputedStyleProbe
        title="Computed styles on the rendered nodes"
        containerRef={containerRef}
        specs={[
          {
            label: "sortable header cell",
            selector: "thead th:nth-child(1)",
            properties: [
              ...boxProperties,
              "position",
              "top",
              "z-index",
              "background-color",
            ],
          },
          {
            label: "non-sortable header cell",
            selector: "thead th:nth-child(3)",
            properties: [...boxProperties, "position", "z-index"],
          },
          {
            label: "row header cell (firstColumn)",
            selector: "tbody tr:nth-child(1) th",
            properties: boxProperties,
          },
          {
            label: "body data cell",
            selector: "tbody tr:nth-child(1) td",
            properties: boxProperties,
          },
        ]}
      />
    </StoryFrame>
  );
};

export const PaddingControlGroup = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <StoryFrame
      title="Control group — TableCell padding variants"
      note="Three plain MUI header cells side by side. The third is the combination AdhocList uses; if sx stopped winning over padding='none', its padding-left would read 0px like the second."
    >
      <div ref={containerRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id="probe-default">default padding</TableCell>
              <TableCell id="probe-none" padding="none">
                padding=&quot;none&quot;
              </TableCell>
              <TableCell
                id="probe-none-sx"
                padding="none"
                sx={{ paddingLeft: "1em" }}
              >
                padding=&quot;none&quot; + sx paddingLeft
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>a</TableCell>
              <TableCell padding="none">b</TableCell>
              <TableCell padding="none" sx={{ paddingLeft: "1em" }}>
                c
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <ComputedStyleProbe
        title="Computed styles for each variant"
        containerRef={containerRef}
        specs={[
          {
            label: "default",
            selector: "#probe-default",
            properties: boxProperties,
          },
          {
            label: "padding='none'",
            selector: "#probe-none",
            properties: boxProperties,
          },
          {
            label: "padding='none' + sx",
            selector: "#probe-none-sx",
            properties: boxProperties,
          },
        ]}
      />
    </StoryFrame>
  );
};

export const StickyHeaderInScrollContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <StoryFrame
      title="Sticky header — scroll the inner box"
      note="The header sx sets position:sticky, top:0, zIndex:3 and a paper background. Scroll the 260px box: the header should stay put and stay opaque."
    >
      <div
        ref={containerRef}
        style={{ height: 260, overflow: "auto", border: "1px solid #ddd" }}
      >
        <AdhocList
          type="unpaginated"
          tableCaption="People"
          titleOptions={{ type: "aria-label", text: "People" }}
          getDataObservable={unpaginatedPeople}
        >
          <AdhocListColumn title="Name" fieldKey="name" sortable />
          <AdhocListColumn title="Role" fieldKey="role" />
          <AdhocListColumn title="Score" fieldKey={["score", "value"]} />
        </AdhocList>
      </div>
      <ComputedStyleProbe
        title="Sticky-related computed styles"
        containerRef={containerRef}
        specs={[
          {
            label: "header cell",
            selector: "thead th:nth-child(1)",
            properties: ["position", "top", "z-index", "background-color"],
          },
        ]}
      />
    </StoryFrame>
  );
};

export const ThemeFacts = () => (
  <StoryFrame
    title="Theme probe"
    note="Default createTheme() values. Compare row by row against the other version's Storybook; a difference here usually explains a difference elsewhere."
  >
    <ThemeProbe />
  </StoryFrame>
);
