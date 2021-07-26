/*
    This component was originally based off of the PaginationActions implementation in
    https://github.com/marmelab/react-admin
*/
import React, { FunctionComponent, useMemo, useCallback } from "react";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import TableCell from "@material-ui/core/TableCell";

const useStyles = makeStyles((theme) =>
  createStyles({
    offScreen: {
      position: "absolute",
      left: "-10000px",
      top: "auto",
      overflow: "hidden",
    },
    actions: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: 20,
    },
    hellip: { padding: "1.2em" },
  })
);

interface TableCellProps extends React.ComponentProps<typeof TableCell> {}
export interface PaginationActionsProps extends TableCellProps {
  backIconButtonProps?: {};
  count: number;
  nextIconButtonProps?: {};
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void;
  page: number;
  rowsPerPage: number;
}

export const PaginationActions: FunctionComponent<PaginationActionsProps & { showEndPages?: boolean; }> = (
  props
) => {
  const { page, rowsPerPage, count, onChangePage, showEndPages = true } = props;

  const classes = useStyles();
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
    if (!showEndPages && page < nbPages - 4 && input.includes('.')) {
      return input.slice(0, input.lastIndexOf('.') + 1)
    }
    return input;
  }, [page, rowsPerPage, count]);

  const nbPages = useMemo(() => Math.ceil(count / rowsPerPage) || 1, [
    count,
    rowsPerPage,
  ]);

  const prevPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (page === 0) {
        throw new Error("Cannot go before page 1");
      }
      onChangePage(event, page - 1);
    },
    [page, onChangePage]
  );

  const nextPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (page > nbPages - 1) {
        throw new Error("Cannot go after last page");
      }
      onChangePage(event, page + 1);
    },
    [page, nbPages, onChangePage]
  );

  const gotoPage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const page = parseInt(event.currentTarget.dataset.page as string, 10);
      if (page < 0 || page > nbPages - 1) {
        throw new Error(`Page number ${page + 1} out of boundaries`);
      }
      onChangePage(event, page);
    },
    [page, nbPages, onChangePage]
  );
  const renderPageNums = () => {
    return range.map((pageNum, index) =>
      pageNum === "." ? (
        <span key={`hyphen_${index}`} className={classes.hellip}>
          &hellip;
        </span>
      ) : (
        <Button
          className="page-number"
          color={pageNum === page + 1 ? "default" : "primary"}
          key={pageNum}
          data-page={pageNum - 1}
          onClick={gotoPage}
          size="small"
        >
          <span className={classes.offScreen}>Page </span>
          {pageNum}
        </Button>
      )
    );
  };
  if (nbPages === 1) {
    return <div className={classes.actions} />;
  }
  return (
    <div className={classes.actions}>
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
    </div>
  );
};

export default PaginationActions;
