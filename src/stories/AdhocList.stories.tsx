/*
  makeAdhocList coverage, all fed from static fixtures (see ./fixtures).
  Paginated and unpaginated, every titleOptions variant, and each remote-data state.
*/
import React from "react";
import { Button, TableCell } from "@mui/material";
import makeAdhocList from "../components/makeAdhocList";
import {
  emptyPaginated,
  failNetworkDown,
  failNotFound,
  failServerError,
  filteredPeople,
  NameFilter,
  paginatedPeople,
  pendingForever,
  Person,
  unpaginatedPeople,
} from "./fixtures";
import { StoryFrame } from "./harness";

export default { title: "Fixtures/AdhocList" };

const { AdhocList, AdhocListColumn } = makeAdhocList<Person>();

const columns = [
  <AdhocListColumn key="name" title="Name" fieldKey="name" sortable />,
  <AdhocListColumn key="role" title="Role" fieldKey="role" sortable />,
  <AdhocListColumn key="dept" title="Department" fieldKey="department" />,
  <AdhocListColumn
    key="score"
    title="Score"
    fieldKey={["score", "value"]}
    sortable
  />,
  <AdhocListColumn
    key="grade"
    title="Grade"
    fieldKey={["score", "grade"]}
    renderdata={(grade: string) => (
      <TableCell>
        <span
          style={{
            display: "inline-block",
            minWidth: "1.5em",
            textAlign: "center",
            border: "1px solid #999",
            borderRadius: 3,
          }}
        >
          {grade}
        </span>
      </TableCell>
    )}
  />,
];

export const Unpaginated = () => (
  <StoryFrame
    title="AdhocList — unpaginated"
    note="42 static rows, no pagination. Second column sorts descending on first render."
  >
    <AdhocList
      type="unpaginated"
      tableCaption="People"
      titleOptions={{
        type: "Typography",
        text: "People",
        TypographyProps: { variant: "h5" },
      }}
      hasRefresh
      getDataObservable={unpaginatedPeople}
    >
      <AdhocListColumn title="Name" fieldKey="name" sortable />
      <AdhocListColumn
        title="Role"
        fieldKey="role"
        sortable
        initialSort="desc"
      />
      <AdhocListColumn title="Department" fieldKey="department" />
      <AdhocListColumn title="Score" fieldKey={["score", "value"]} sortable />
    </AdhocList>
  </StoryFrame>
);

export const PaginatedOneIndexed = () => (
  <StoryFrame
    title="AdhocList — paginated, pagesNIndexed=1"
    note="42 rows / 10 per page. Custom renderdata cell in the Grade column."
  >
    <AdhocList
      type="paginated"
      pagesNIndexed={1}
      defaultSize={10}
      tableCaption="People"
      titleOptions={{
        type: "Typography",
        text: "People",
        TypographyProps: { variant: "h5" },
      }}
      hasRefresh
      getDataObservable={paginatedPeople({ pagesNIndexed: 1 })}
    >
      {columns}
    </AdhocList>
  </StoryFrame>
);

export const PaginatedZeroIndexed = () => (
  <StoryFrame
    title="AdhocList — paginated, pagesNIndexed=0"
    note="Same data, 0-based page numbering, rows-per-page options [5, 10, 25, 100]."
  >
    <AdhocList
      type="paginated"
      pagesNIndexed={0}
      defaultSize={5}
      tableCaption="People"
      titleOptions={{ type: "aria-label", text: "People" }}
      getDataObservable={paginatedPeople({ pagesNIndexed: 0 })}
    >
      {columns}
    </AdhocList>
  </StoryFrame>
);

export const PaginatedBeyondMaxExactTotalCount = () => (
  <StoryFrame
    title="AdhocList — maxExactTotalCount"
    note="total=100000 with maxExactTotalCount=5000: the count reads '5000+' and, away from the end, the jump-to-last page buttons are withheld."
  >
    <AdhocList
      type="paginated"
      pagesNIndexed={1}
      defaultSize={10}
      maxExactTotalCount={5000}
      tableCaption="People"
      titleOptions={{
        type: "Typography",
        text: "Large result set",
        TypographyProps: { variant: "h5" },
      }}
      getDataObservable={paginatedPeople({ pagesNIndexed: 1, total: 100000 })}
    >
      {columns}
    </AdhocList>
  </StoryFrame>
);

export const WithFilter = () => (
  <StoryFrame
    title="AdhocList — renderFilter"
    note="Filter state is seeded to an empty string; typing filters the fixture in memory."
  >
    <AdhocList
      type="paginated"
      pagesNIndexed={1}
      defaultSize={10}
      tableCaption="People"
      titleOptions={{
        type: "Typography",
        text: "People",
        TypographyProps: { variant: "h5" },
      }}
      initialFilter={{ name: "" } as NameFilter}
      renderFilter={({ filter, setFilter, fetchData }) => (
        <div style={{ margin: "8px 0", display: "flex", gap: 8 }}>
          <label htmlFor="fixture-name-filter">Name contains</label>
          <input
            id="fixture-name-filter"
            type="text"
            value={filter.name}
            onChange={(e) => setFilter({ name: e.target.value })}
          />
          <button onClick={fetchData}>Search</button>
        </div>
      )}
      getDataObservable={filteredPeople({ pagesNIndexed: 1 })}
    >
      {columns}
    </AdhocList>
  </StoryFrame>
);

export const TitleOptionsRender = () => (
  <StoryFrame
    title="AdhocList — titleOptions type='render' + TopRightAction + renderBelowTitle"
    note="The render callback receives the id the table's aria-labelledby points at."
  >
    <AdhocList
      type="unpaginated"
      tableCaption="People"
      titleOptions={{
        type: "render",
        render: (elementId) => (
          <h3 id={elementId} style={{ margin: 0 }}>
            Rendered title
          </h3>
        ),
      }}
      TopRightAction={
        <Button size="small" variant="outlined">
          Add person
        </Button>
      }
      hasRefresh
      renderBelowTitle={() => (
        <p style={{ margin: "4px 0", color: "#666" }}>
          Anything can go below the title.
        </p>
      )}
      getDataObservable={unpaginatedPeople}
    >
      <AdhocListColumn title="Name" fieldKey="name" sortable />
      <AdhocListColumn title="Role" fieldKey="role" />
    </AdhocList>
  </StoryFrame>
);

export const NoResults = () => (
  <StoryFrame
    title="AdhocList — renderNoResults"
    note="total === 0 with a renderNoResults callback replaces the table entirely."
  >
    <AdhocList
      type="paginated"
      pagesNIndexed={1}
      defaultSize={10}
      tableCaption="People"
      titleOptions={{
        type: "Typography",
        text: "People",
        TypographyProps: { variant: "h5" },
      }}
      renderNoResults={({ refresh }) => (
        <div style={{ padding: 24, textAlign: "center", color: "#666" }}>
          <p>Nothing matched.</p>
          <Button size="small" onClick={refresh}>
            Try again
          </Button>
        </div>
      )}
      getDataObservable={emptyPaginated}
    >
      {columns}
    </AdhocList>
  </StoryFrame>
);

export const StatePending = () => (
  <StoryFrame
    title="AdhocList — pending"
    note="The observable never emits, so the loading state stays put."
  >
    <AdhocList
      type="unpaginated"
      tableCaption="People"
      iconAndTextSize="md"
      titleOptions={{ type: "aria-label", text: "People" }}
      getDataObservable={pendingForever}
    >
      <AdhocListColumn title="Name" fieldKey="name" />
    </AdhocList>
  </StoryFrame>
);

export const StateServerError = () => (
  <StoryFrame title="AdhocList — 500" note="AjaxError with status 500.">
    <AdhocList
      type="unpaginated"
      tableCaption="People"
      titleOptions={{ type: "aria-label", text: "People" }}
      getDataObservable={failServerError}
    >
      <AdhocListColumn title="Name" fieldKey="name" />
    </AdhocList>
  </StoryFrame>
);

export const StateNotFound = () => (
  <StoryFrame
    title="AdhocList — 404"
    note="message 'ajax error 404' is special-cased to the friendlier 'Not Found'."
  >
    <AdhocList
      type="unpaginated"
      tableCaption="People"
      titleOptions={{ type: "aria-label", text: "People" }}
      getDataObservable={failNotFound}
    >
      <AdhocListColumn title="Name" fieldKey="name" />
    </AdhocList>
  </StoryFrame>
);

export const StateNetworkUnavailable = () => (
  <StoryFrame
    title="AdhocList — network unavailable"
    note="status 0 selects the offline state, which offers a Retry button."
  >
    <AdhocList
      type="unpaginated"
      tableCaption="People"
      titleOptions={{ type: "aria-label", text: "People" }}
      getDataObservable={failNetworkDown}
    >
      <AdhocListColumn title="Name" fieldKey="name" />
    </AdhocList>
  </StoryFrame>
);
