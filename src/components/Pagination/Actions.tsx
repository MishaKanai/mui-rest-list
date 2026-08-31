/*
    This component was originally based off of the PaginationActions implementation in
    https://github.com/marmelab/react-admin
*/
import React, { FunctionComponent, useMemo, useCallback } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import TableCell from "@mui/material/TableCell";

// v2 (MUI v5): the JSS sheet is gone — the theme-reading `actions` rule became `sx` on a Box
// (same rendered div), the static rules became inline styles.
const offScreenStyle: React.CSSProperties = {
  position: "absolute",
  left: "-10000px",
  top: "auto",
  overflow: "hidden",
};
const actionsSx = {
  flexShrink: 0,
  color: "text.secondary",
  marginLeft: "20px",
} as const;
const hellipStyle: React.CSSProperties = { padding: "1.2em" };

interface TableCellProps extends React.ComponentProps<typeof TableCell> {}
export interface PaginationActionsProps extends TableCellProps {
  backIconButtonProps?: {};
  count: number;
  nextIconButtonProps?: {};
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void;
  page: number;
  rowsPerPage: number;
}

export const PaginationActions: FunctionComponent<
  PaginationActionsProps & { showEndPages?: boolean }
> = (props) => {
  const { page, rowsPerPage, count, onPageChange, showEndPages = true } = props;
  /**
   * Warning: material-ui's page is 0-based
   */
  const range = useMemo(() => {
    const nbPages = Math.ceil(count / rowsPerPage) || 1;
    if (isNaN(page) || nbPages === 1) {
      return [];
    }
    const input: (number | ".")[] = [];
    // display page links around the current page
    if (page > 1) {
      input.push(1);
    }
    if (page === 3) {
      input.push(2);
    }
    if (page > 3) {
      input.push(".");
    }
    if (page > 0) {
      input.push(page);
    }
    input.push(page + 1);
    if (page < nbPages - 1) {
      input.push(page + 2);
    }
    if (page === nbPages - 4) {
      input.push(nbPages - 1);
    }
    if (page < nbPages - 4) {
      input.push(".");
    }
    if (page < nbPages - 2) {
      input.push(nbPages);
    }
    if (!showEndPages && page < nbPages - 4 && input.includes(".")) {
      return input.slice(0, input.lastIndexOf(".") + 1);
    }
    return input;
  }, [page, rowsPerPage, count]);

  const nbPages = useMemo(
    () => Math.ceil(count / rowsPerPage) || 1,
    [count, rowsPerPage]
  );

  const prevPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (page === 0) {
        throw new Error("Cannot go before page 1");
      }
      onPageChange(event, page - 1);
    },
    [page, onPageChange]
  );

  const nextPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (page > nbPages - 1) {
        throw new Error("Cannot go after last page");
      }
      onPageChange(event, page + 1);
    },
    [page, nbPages, onPageChange]
  );

  const gotoPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const page = parseInt(event.currentTarget.dataset.page as string, 10);
      if (page < 0 || page > nbPages - 1) {
        throw new Error(`Page number ${page + 1} out of boundaries`);
      }
      onPageChange(event, page);
    },
    [page, nbPages, onPageChange]
  );
  const renderPageNums = () => {
    return range.map((pageNum, index) =>
      pageNum === "." ? (
        <span key={`hyphen_${index}`} style={hellipStyle}>
          &hellip;
        </span>
      ) : (
        <Button
          className="page-number"
          // v5 removed color="default"; "inherit" renders the same neutral text button the
          // current-page number had under v4.
          color={pageNum === page + 1 ? "inherit" : "primary"}
          key={pageNum}
          data-page={pageNum - 1}
          onClick={gotoPage}
          size="small"
        >
          <span style={offScreenStyle}>Page </span>
          {pageNum}
        </Button>
      )
    );
  };
  if (nbPages === 1) {
    return <Box sx={actionsSx} />;
  }
  return (
    <Box sx={actionsSx}>
      {page > 0 && (
        <Button
          color="primary"
          key="prev"
          onClick={prevPage}
          className="previous-page"
          size="small"
        >
          <ChevronLeft />
          Prev
        </Button>
      )}
      {renderPageNums()}
      {page !== nbPages - 1 && (
        <Button
          color="primary"
          key="next"
          onClick={nextPage}
          className="next-page"
          size="small"
        >
          Next
          <ChevronRight />
        </Button>
      )}
    </Box>
  );
};

export default PaginationActions;
