/*
  Pagination and its custom numbered PaginationActions, driven by fixed page/total numbers.

  The page numbers here are chosen to hit every branch of the range builder in
  components/Pagination/Actions.tsx: no ellipsis, a leading ellipsis, both ellipses, and the
  truncated form used when the true total is unknown.
*/
import React, { useState } from "react";
import Pagination from "../components/Pagination";
import PaginationActions from "../components/Pagination/Actions";
import { StoryFrame } from "./harness";

export default { title: "Fixtures/Pagination" };

const LivePagination = (props: {
  initialPage: number;
  perPage: number;
  total: number;
  showSmall?: boolean;
  maxExactTotalCount?: number;
  rowsPerPageOptions?: number[];
}) => {
  const [page, setPage] = useState(props.initialPage);
  const [perPage, setPerPage] = useState(props.perPage);
  return (
    <Pagination
      page={page}
      perPage={perPage}
      setPage={setPage}
      setPerPage={setPerPage}
      total={props.total}
      showSmall={props.showSmall}
      maxExactTotalCount={props.maxExactTotalCount}
      rowsPerPageOptions={props.rowsPerPageOptions}
    />
  );
};

// Unless showSmall is set, Pagination picks its layout from useWidth(), i.e. the real viewport.
// These stories assume a window wider than the `sm` breakpoint.
export const FirstPage = () => (
  <StoryFrame
    title="Pagination — first page"
    note="420 rows / 10 per page, page 1 of 42."
  >
    <LivePagination initialPage={1} perPage={10} total={420} />
  </StoryFrame>
);

export const MiddlePageBothEllipses = () => (
  <StoryFrame
    title="Pagination — middle page"
    note="page 12 of 42: an ellipsis on each side of the current page."
  >
    <LivePagination initialPage={12} perPage={10} total={420} />
  </StoryFrame>
);

export const SecondPageNoLeadingEllipsis = () => (
  <StoryFrame
    title="Pagination — page 3"
    note="Close enough to the start that page 2 is listed instead of an ellipsis."
  >
    <LivePagination initialPage={3} perPage={10} total={420} />
  </StoryFrame>
);

export const LastPage = () => (
  <StoryFrame
    title="Pagination — last page"
    note="page 42 of 42: no Next button."
  >
    <LivePagination initialPage={42} perPage={10} total={420} />
  </StoryFrame>
);

export const SinglePage = () => (
  <StoryFrame
    title="Pagination — single page"
    note="5 rows / 10 per page: the actions area renders empty, the label still reads 1-5 of 5."
  >
    <LivePagination initialPage={1} perPage={10} total={5} />
  </StoryFrame>
);

export const SmallVariant = () => (
  <StoryFrame
    title="Pagination — small variant"
    note="showSmall pins the compact layout that useWidth() would otherwise select at xs: no rows-per-page select, plain prev/next arrows."
  >
    <LivePagination initialPage={4} perPage={10} total={420} showSmall />
  </StoryFrame>
);

export const BeyondMaxExactTotalCountMidRange = () => (
  <StoryFrame
    title="Pagination — beyond maxExactTotalCount, mid range"
    note="total=100000, maxExactTotalCount=5000, page 3. Count reads '5000+' and the trailing page numbers are withheld, because the true last page is unknown."
  >
    <LivePagination
      initialPage={3}
      perPage={10}
      total={100000}
      maxExactTotalCount={5000}
    />
  </StoryFrame>
);

export const BeyondMaxExactTotalCountNearEnd = () => (
  <StoryFrame
    title="Pagination — beyond maxExactTotalCount, near the end"
    note="Same numbers, but within three pages of the end, so the end pages come back."
  >
    <LivePagination
      initialPage={9999}
      perPage={10}
      total={100000}
      maxExactTotalCount={5000}
    />
  </StoryFrame>
);

export const CustomRowsPerPageOptions = () => (
  <StoryFrame
    title="Pagination — custom rows-per-page options"
    note="Options accumulate: the current perPage is folded in even when it is not in the list."
  >
    <LivePagination
      initialPage={1}
      perPage={15}
      total={420}
      rowsPerPageOptions={[10, 20, 50]}
    />
  </StoryFrame>
);

const noop = () => undefined;

export const ActionsInIsolation = () => (
  <StoryFrame
    title="PaginationActions — standalone"
    note="The custom numbered actions on their own. page is 0-based here, matching MUI's convention."
  >
    <div style={{ display: "grid", gap: 12 }}>
      {[
        { label: "page 0 of 42 (no Prev)", page: 0, showEndPages: true },
        { label: "page 2 of 42", page: 2, showEndPages: true },
        {
          label: "page 11 of 42 (both ellipses)",
          page: 11,
          showEndPages: true,
        },
        { label: "page 41 of 42 (no Next)", page: 41, showEndPages: true },
        {
          label: "page 11 of 42, showEndPages=false",
          page: 11,
          showEndPages: false,
        },
      ].map((c) => (
        <div key={c.label}>
          <div
            style={{
              font: "400 12px/1.5 ui-monospace, Menlo, Consolas, monospace",
              color: "#666",
            }}
          >
            {c.label}
          </div>
          <PaginationActions
            count={420}
            rowsPerPage={10}
            page={c.page}
            showEndPages={c.showEndPages}
            onPageChange={noop}
          />
        </div>
      ))}
    </div>
  </StoryFrame>
);

export const ActionsSinglePage = () => (
  <StoryFrame
    title="PaginationActions — single page"
    note="nbPages === 1 renders the styled container and nothing else."
  >
    <div style={{ outline: "1px dashed #bbb" }}>
      <PaginationActions
        count={5}
        rowsPerPage={10}
        page={0}
        onPageChange={noop}
      />
    </div>
  </StoryFrame>
);
