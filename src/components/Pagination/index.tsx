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
import PaginationActions from "./Actions";
import uniqueId from "lodash.uniqueid";
import useWidth from "../../util/useWidth";

interface PaginationProps {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  total: number;

  showSmall?: boolean;
  classes?: {};
  className?: string;
  rowsPerPageOptions?: number[];
  SelectProps?: {};
}
const emptyArray: number[] = [];
const defaultRowsPerPageOptions = [5, 10, 25, 100];

const Pagination: FunctionComponent<PaginationProps> = (props) => {
  const {
    total,
    perPage,
    setPage,
    page,
    setPerPage,
    rowsPerPageOptions = defaultRowsPerPageOptions,
    showSmall,
  } = props;
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
  const labelDisplayedRows = useCallback(
    ({ from, to, count }: LabelDisplayedRowsArgs) => {
      return `${from}-${to} of ${count}`;
    },
    []
  );

  if (total === 0) {
    return null;
  }
  const small = (
    <TablePagination
      count={total}
      rowsPerPage={perPage}
      page={page - 1}
      onChangePage={handlePageChange}
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
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerPageChange}
      ActionsComponent={PaginationActions}
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
