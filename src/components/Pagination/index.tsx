import React, {
  Component,
  FunctionComponent,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import TablePagination, {
  LabelDisplayedRowsArgs,
} from "@material-ui/core/TablePagination";
import PaginationActions, { PaginationActionsProps } from "./Actions";
import uniqueId from "lodash.uniqueid";
import useWidth from "../../util/useWidth";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";

const PaginationWithEnd = (props: PaginationActionsProps) => (
  <PaginationActions {...props} />
);
const PaginationWithoutEnd = (props: PaginationActionsProps) => (
  <PaginationActions {...props} showEndPages={false} />
);

export interface PaginationProps {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  total: number;
  // If count(*) is very expensive, we might have a 'maxExactTotalCount', for which any total above that indicates we didn't do the full count.
  // E.g. if maxExactTotalCount={5000} and total is 5001, the true total might be any number > 5000.
  // In that case, we should display '1 of 5000+' as the count, and not show buttons to skip to the last page, since we don't know how many pages there are.
  maxExactTotalCount?: number;

  showSmall?: boolean;
  classes?: {};
  className?: string;
  rowsPerPageOptions?: number[];
  SelectProps?: {};
}
const emptyArray: number[] = [];
const defaultRowsPerPageOptions = [5, 10, 25, 100];

const useAccumulatePerPageOptions = (
  initialOptions: number[],
  perPage: number
) => {
  const initialSet = useMemo(() => new Set(initialOptions), []);
  const accumulatePerPagesSet = useRef(initialSet);
  return useMemo(() => {
    initialOptions.forEach((option) =>
      accumulatePerPagesSet.current.add(option)
    );
    if (typeof perPage === "number") {
      accumulatePerPagesSet.current.add(perPage);
    }
    return Array.from(accumulatePerPagesSet.current).sort((a, b) => a - b);
  }, [initialOptions, perPage]);
};

const Pagination: FunctionComponent<PaginationProps> = (props) => {
  const {
    total,
    perPage,
    setPage,
    page,
    setPerPage,
    rowsPerPageOptions: _rowsPerPageOptions = defaultRowsPerPageOptions,
    showSmall,
    maxExactTotalCount,
  } = props;
  const rowsPerPageOptions = useAccumulatePerPageOptions(
    _rowsPerPageOptions,
    perPage
  );
  const width = useWidth();
  const rppId = useMemo(() => uniqueId("rowsPerPage"), []);
  const mediumRPPLabelId = useRef(rppId);
  const nbPages = useMemo(() => Math.ceil(total / perPage) || 1, [
    total,
    perPage,
  ]);
  useEffect(() => {
    if (page < 1 || isNaN(page)) {
      setPage(1);
    }
  }, [page]);
  const handlePageChange = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
      page: number
    ) => {
      if (event) {
        event.stopPropagation();
      }
      if (page < 0 || page > nbPages - 1) {
        throw new Error(`Page number ${page + 1} out of boundaries`);
      }
      setPage(page + 1);
    },
    [nbPages, page, setPage]
  );
  const handlePerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setPerPage(
        typeof event.target.value === "string"
          ? parseInt(event.target.value, 10)
          : event.target.value
      );
    },
    [setPerPage]
  );
  const beyondMaxExactTotalCount = Boolean(
    maxExactTotalCount && total > maxExactTotalCount
  );
  const labelDisplayedRows = useCallback(
    ({ from, to, count, page }: LabelDisplayedRowsArgs) => {
      return `${from}-${to} of ${
        beyondMaxExactTotalCount && maxExactTotalCount ? Math.max(to, maxExactTotalCount) + "+" : count
      }`;
    },
    [beyondMaxExactTotalCount, maxExactTotalCount]
  );

  const PaginationComponent = useMemo(() => {
    // if we are not on/near the final page, and beyondMaxExactTotalCount, don't show the final pages.

    if (
      !beyondMaxExactTotalCount ||
      page === nbPages - 1 ||
      page === nbPages - 2 ||
      page === nbPages - 3
    ) {
      return PaginationWithEnd;
    }
    return PaginationWithoutEnd;
  }, [beyondMaxExactTotalCount, page, nbPages]);

  if (total === 0) {
    return null;
  }
  const small = (
    <TablePagination
      count={total}
      rowsPerPage={perPage}
      page={page - 1}
      onPageChange={handlePageChange}
      rowsPerPageOptions={emptyArray}
      component="span"
      labelDisplayedRows={labelDisplayedRows}
      backIconButtonProps={{
        "aria-label": "previous page",
      }}
      nextIconButtonProps={{
        "aria-label": "next page",
      }}
      SelectProps={{
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        MenuProps: {
          style: { zIndex: 100000 },
        },
      }}
    />
  );
  const medium = (
    <TablePagination
      count={total}
      rowsPerPage={perPage}
      page={page - 1}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePerPageChange}
      ActionsComponent={PaginationComponent}
      component="span"
      // In the near future we should be able to use labelId={this.mediumRPPLabelId}
      // for now it causes an annoying proptype error...
      labelRowsPerPage={
        <span id={mediumRPPLabelId.current}>Rows per page:</span>
      }
      labelDisplayedRows={labelDisplayedRows}
      rowsPerPageOptions={rowsPerPageOptions}
      SelectProps={{
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        MenuProps: {
          style: { zIndex: 100000 },
        },
        SelectDisplayProps: {
          "aria-describedby": mediumRPPLabelId.current,
        },
        ...props.SelectProps,
      }}
    />
  );
  return showSmall || width === "xs" ? small : medium;
};
export default Pagination;
