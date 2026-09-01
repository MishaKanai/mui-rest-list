/*
  Shared scaffolding for the version-comparison stories.

  The probes below render as plain HTML with inline styles on purpose: they must look the same
  under every MUI major, so that any pixel difference in a probe is a difference in the value
  being reported rather than in the reporter.
*/
import React, { useEffect, useRef, useState } from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

const fixedTheme = createTheme();

const monospace = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/**
 * Fixed pixel width rather than a fluid one, so a screenshot does not depend on the window the
 * story happens to be opened in. (`Pagination` still reads the real viewport through
 * useWidth() — the story that cares pins the variant explicitly.)
 */
export const StoryFrame = (props: {
  title: string;
  note?: string;
  width?: number;
  children: React.ReactNode;
}) => (
  <ThemeProvider theme={fixedTheme}>
    <div
      style={{
        width: props.width ?? 1080,
        padding: 16,
        background: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <div style={{ font: `600 13px/1.5 ${monospace}`, color: "#222" }}>
        {props.title}
      </div>
      {props.note ? (
        <div
          style={{
            font: `400 12px/1.5 ${monospace}`,
            color: "#666",
            marginTop: 2,
          }}
        >
          {props.note}
        </div>
      ) : null}
      <div style={{ marginTop: 12 }}>{props.children}</div>
    </div>
  </ThemeProvider>
);

const cell: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "3px 8px",
  font: `400 12px/1.5 ${monospace}`,
  textAlign: "left",
  whiteSpace: "nowrap",
};

const ProbeTable = (props: { head: string[]; rows: string[][] }) => (
  <table style={{ borderCollapse: "collapse", marginTop: 8 }}>
    <thead>
      <tr>
        {props.head.map((h) => (
          <th
            key={h}
            style={{ ...cell, background: "#f4f4f4", fontWeight: 600 }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {props.rows.map((r, i) => (
        <tr key={i}>
          {r.map((v, j) => (
            <td key={j} style={cell}>
              {v}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export type ProbeSpec = {
  label: string;
  selector: string;
  properties: string[];
};

/**
 * Reads getComputedStyle off real rendered nodes and prints the values.
 *
 * This is the only way to check things like "the header cell's `sx` paddingLeft beats the
 * cell's own padding='none'" — that depends on emotion's style injection order, which no
 * jsdom-based test can see. Printing the number makes the comparison exact instead of an
 * eyeball judgement.
 *
 * Measurement retries because the list fills in from an observable after the first paint.
 */
export const ComputedStyleProbe = (props: {
  title: string;
  specs: ProbeSpec[];
  containerRef: React.RefObject<HTMLElement>;
}) => {
  const [rows, setRows] = useState<string[][]>([]);
  const specsRef = useRef(props.specs);
  specsRef.current = props.specs;

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const measure = () => {
      if (cancelled) {
        return;
      }
      const root = props.containerRef.current;
      const specs = specsRef.current;
      const next: string[][] = [];
      let missing = false;
      specs.forEach((spec) => {
        const el = root ? root.querySelector(spec.selector) : null;
        if (!el) {
          missing = true;
          next.push([spec.label, spec.selector, "(not found yet)", ""]);
          return;
        }
        const computed = window.getComputedStyle(el);
        spec.properties.forEach((property, i) => {
          next.push([
            i === 0 ? spec.label : "",
            i === 0 ? spec.selector : "",
            property,
            computed.getPropertyValue(property).trim(),
          ]);
        });
      });
      setRows(next);
      if (missing && attempts < 60) {
        attempts += 1;
        setTimeout(measure, 50);
      }
    };
    measure();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ font: `600 12px/1.5 ${monospace}`, color: "#222" }}>
        {props.title}
      </div>
      <ProbeTable
        head={["element", "selector", "property", "computed value"]}
        rows={rows}
      />
    </div>
  );
};

/**
 * Default-theme facts. The source is identical on both branches, so every row is directly
 * comparable between the 2.x and 3.x Storybooks: a difference here is a MUI default that moved,
 * and usually explains a difference somewhere else.
 */
export const ThemeProbe = () => {
  const theme = useTheme();
  const anyTheme = theme as unknown as Record<string, unknown>;
  const rows: string[][] = [
    ["typeof theme.applyStyles", typeof anyTheme.applyStyles],
    ["Boolean(theme.vars)", String(Boolean(anyTheme.vars))],
    ["theme.shape.borderRadius", String(theme.shape.borderRadius)],
    ["theme.spacing(1)", String(theme.spacing(1))],
    ["theme.typography.fontFamily", String(theme.typography.fontFamily)],
    ["theme.typography.fontSize", String(theme.typography.fontSize)],
    [
      "theme.typography.body2.fontSize",
      String(theme.typography.body2.fontSize),
    ],
    ["theme.palette.primary.main", theme.palette.primary.main],
    ["theme.palette.text.primary", theme.palette.text.primary],
    ["theme.palette.text.secondary", theme.palette.text.secondary],
    ["theme.palette.background.paper", theme.palette.background.paper],
    ["theme.palette.divider", theme.palette.divider],
  ];
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ font: `600 12px/1.5 ${monospace}`, color: "#222" }}>
        Theme probe — default createTheme() values
      </div>
      <ProbeTable head={["theme path", "value"]} rows={rows} />
    </div>
  );
};
