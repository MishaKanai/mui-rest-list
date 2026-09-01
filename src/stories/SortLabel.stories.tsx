/*
  TableHeader/SortLabel, including the tooltip.

  The tooltip stories are the interesting ones for a 2.x-vs-3.x comparison. AdhocList wraps
  every sortable header in <Tooltip title="Sort">, but a Tooltip only works if its child can
  hold a ref and accept the cloned hover handlers. In 2.x SortLabel is a plain function
  component and can do neither, so the tooltip never appears; in 3.x it forwards its ref and
  passes the extra props through, so it does. The story source is identical on both branches.
*/
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import SortLabel, { SortArrows } from "../components/TableHeader/SortLabel";
import { StoryFrame } from "./harness";

export default { title: "Fixtures/SortLabel" };

const Row = (props: { label: string; children: React.ReactNode }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 16, minHeight: 40 }}
  >
    <div
      style={{
        width: 260,
        font: "400 12px/1.5 ui-monospace, Menlo, Consolas, monospace",
        color: "#666",
      }}
    >
      {props.label}
    </div>
    {props.children}
  </div>
);

export const LabelStates = () => (
  <StoryFrame
    title="SortLabel — sort states"
    note="Inactive shows the dimmed double arrow; active shows a single arrow in the sort direction."
  >
    <div style={{ display: "grid", gap: 8 }}>
      <Row label="active=false">
        <SortLabel label="Name" />
      </Row>
      <Row label="active, direction='asc'">
        <SortLabel label="Name" active direction="asc" />
      </Row>
      <Row label="active, direction='desc'">
        <SortLabel label="Name" active direction="desc" />
      </Row>
      <Row label="long label">
        <SortLabel
          label="Department of Redundancy Department"
          active
          direction="asc"
        />
      </Row>
    </div>
  </StoryFrame>
);

export const ArrowsOnly = () => (
  <StoryFrame
    title="SortArrows — exported sub-component"
    note="The arrow cluster on its own, in each of its three states."
  >
    <div style={{ display: "grid", gap: 8 }}>
      <Row label="inactive (double arrow)">
        <SortArrows />
      </Row>
      <Row label="active asc">
        <SortArrows active direction="asc" />
      </Row>
      <Row label="active desc">
        <SortArrows active direction="desc" />
      </Row>
    </div>
  </StoryFrame>
);

export const TooltipForcedOpen = () => (
  <StoryFrame
    title="SortLabel in a Tooltip — open pinned to true"
    note="3.x: the 'Sort' tooltip is anchored to the button. 2.x: SortLabel cannot hold the ref, so the tooltip has no anchor — expect it missing or parked in the corner, plus a React ref warning in the console."
  >
    <div style={{ padding: "72px 24px 24px" }}>
      <Tooltip title="Sort" open>
        <SortLabel label="Name" active direction="asc" />
      </Tooltip>
    </div>
  </StoryFrame>
);

export const TooltipOnHover = () => (
  <StoryFrame
    title="SortLabel in a Tooltip — hover to open"
    note="The real configuration AdhocList uses (enterDelay 300ms). Hover the button: in 3.x the tooltip appears, in 2.x nothing happens."
  >
    <div style={{ padding: "72px 24px 24px" }}>
      <Tooltip title="Sort" enterDelay={300}>
        <SortLabel label="Name" active direction="asc" />
      </Tooltip>
    </div>
  </StoryFrame>
);

export const InTableHeader = () => (
  <StoryFrame
    title="SortLabel inside a table header"
    note="How AdhocList assembles it: TableCell padding='none' with the sticky header sx, wrapping a tooltipped SortLabel."
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell
            padding="none"
            sx={{
              position: "sticky",
              zIndex: 3,
              backgroundColor: "background.paper",
              top: 0,
              paddingLeft: "1em",
            }}
            sortDirection="asc"
          >
            <Tooltip title="Sort" enterDelay={300}>
              <SortLabel label="Name" active direction="asc" />
            </Tooltip>
          </TableCell>
          <TableCell
            padding="none"
            sx={{
              position: "sticky",
              zIndex: 3,
              backgroundColor: "background.paper",
              top: 0,
              paddingLeft: "1em",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                verticalAlign: "middle",
                lineHeight: "normal",
              }}
            >
              <b>Not sortable</b>
            </span>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row">
            Ada Lovelace
          </TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </StoryFrame>
);
