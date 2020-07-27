import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useMemo,
} from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  createStyles,
  makeStyles,
  Typography,
  TypographyProps,
  TableProps,
  TableCellProps,
} from "@material-ui/core";
import { Observable } from "rxjs";
import {
  initial,
  RemoteData,
  failure,
  success,
  pending,
  fold,
} from "@devexperts/remote-data-ts";
import { AjaxError } from "rxjs/ajax";
import Refresh from "@material-ui/icons/Refresh";
// import Pagination from "components/generics/genericList/RaPagination";
import get from "lodash.get";
import { Size, NetworkUnavailable, ServerError, Pending } from "./states";
import Pagination from "./Pagination";
import uniqueId from "lodash.uniqueid";

const usePagination = (pagesNIndexed: 0 | 1, defaultSize: number = 10) => {
  const [paginationState, dispatch] = useReducer(
    (
      state: { size: number; page: number },
      action:
        | {
            type: "SET_PAGE";
            page: number;
          }
        | {
            type: "SET_SIZE";
            size: number;
          }
    ) => {
      switch (action.type) {
        case "SET_PAGE":
          return { ...state, page: action.page };
        case "SET_SIZE":
          return { ...state, size: action.size };
      }
      return state;
    },
    { page: pagesNIndexed, size: defaultSize }
  );
  return [paginationState, dispatch] as const;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    offScreen: {
      position: "absolute",
      left: "-10000px",
      top: "auto",
      height: 0,
      width: 0,
      overflow: "hidden",
    },
  })
);
const HiddenAriaLive = <T extends any>(props: {
  remoteData: RemoteData<AjaxError, { data: T[]; total: number }>;
  resourceDisplayName?: string;
}) => {
  const { remoteData, resourceDisplayName = "Results" } = props;
  const classes = useStyles();
  return (
    <span aria-live="polite" aria-atomic="true" className={classes.offScreen}>
      {fold<AjaxError, { data: T[]; total: number }, string>(
        () => "",
        () => "loading",
        (e) => "Search failed: " + e.message,
        ({ data, total }) =>
          total > 0
            ? `Showing ${data.length} out of ${total} ${resourceDisplayName}`
            : `No ${resourceDisplayName} found`
      )(remoteData)}
    </span>
  );
};

export interface AdHocColumnProps1<
  DataShape,
  FieldKey1 extends keyof DataShape
> {
  title: string;
  hideColTitle?: boolean;
  fieldKey: FieldKey1;
  firstColumn?: boolean;
  renderdata?: (
    fieldData: DataShape[FieldKey1],
    rowData: DataShape,
    i: number
  ) => JSX.Element;
}
export interface AdHocColumnProps2<
  DataShape,
  FieldKey1 extends keyof DataShape,
  FieldKey2 extends keyof DataShape[FieldKey1]
> {
  title: string;
  hideColTitle?: boolean;
  firstColumn?: boolean;
  fieldKey: [FieldKey1, FieldKey2];
  renderdata?: (
    fieldData: DataShape[FieldKey1][FieldKey2],
    rowData: DataShape,
    i: number
  ) => JSX.Element;
}
export interface AdHocColumnProps3<
  DataShape,
  FieldKey1 extends keyof DataShape,
  FieldKey2 extends keyof DataShape[FieldKey1],
  FieldKey3 extends keyof DataShape[FieldKey1][FieldKey2]
> {
  title: string;
  hideColTitle?: boolean;
  firstColumn?: boolean;
  fieldKey: [FieldKey1, FieldKey2, FieldKey3];
  renderdata?: (
    fieldData: DataShape[FieldKey1][FieldKey2][FieldKey3],
    rowData: DataShape,
    i: number
  ) => JSX.Element;
}

export type AdhocListColumnProps<
  DataShape,
  FieldKey1 extends keyof DataShape,
  FieldKey2 extends keyof DataShape[FieldKey1],
  FieldKey3 extends keyof DataShape[FieldKey1][FieldKey2]
> =
  | AdHocColumnProps1<DataShape, FieldKey1>
  | AdHocColumnProps2<DataShape, FieldKey1, FieldKey2>
  | AdHocColumnProps3<DataShape, FieldKey1, FieldKey2, FieldKey3>;

const makeAdhocList = <DataShape extends {}>() => {
  type RowContext = {
    rowData: DataShape;
    i: number;
  };
  const rowContext = React.createContext<RowContext | null>(null);

  const AdhocListColumn = <
    FieldKey1 extends keyof DataShape,
    FieldKey2 extends keyof DataShape[FieldKey1],
    FieldKey3 extends keyof DataShape[FieldKey1][FieldKey2]
  >(
    props: AdhocListColumnProps<DataShape, FieldKey1, FieldKey2, FieldKey3>
  ): React.ReactElement<any> => {
    const rc = useContext(rowContext);
    if (!rc) {
      throw new Error(
        "an <AdhocListColumn> must be a child of <AdhocList></AdhocList>"
      );
    }
    const TableCellProps: TableCellProps | null = props.firstColumn
      ? { component: "th", scope: "row" }
      : null;
    const { rowData, i } = rc;
    if (props.renderdata) {
      const resultElement = props.renderdata(
        get(rowData, props.fieldKey),
        rowData,
        i
      );
      if (resultElement.type !== TableCell) {
        throw new Error(
          `render prop on AdhocListColumn must return a <TableCell> element
          (Also ensure you are using a matching version of @material-ui/core)`
        );
      }
      return resultElement;
    }
    const fieldData = get(rowData, props.fieldKey);
    if (typeof fieldData === "string" || typeof fieldData === "number") {
      return <TableCell {...TableCellProps}>{fieldData}</TableCell>;
    }
    // todo handle dates.
    if (typeof fieldData === "object") {
      return <TableCell {...TableCellProps}>Unhandled Object Type</TableCell>;
    }
    return <TableCell {...TableCellProps} />;
  };
  type TitleOptions<
    TitleTypographyComponent extends React.ElementType = "span"
  > =
    | {
        type: "Typography";
        text: string;
        TypographyProps?: TypographyProps<
          TitleTypographyComponent,
          { component?: TitleTypographyComponent }
        >;
      }
    | {
        type: "aria-label";
        text: string;
      }
    | {
        type: "aria-labelled-by";
        id: string;
      }
    | {
        type: "render";
        // pass elementId to your label so we an point the title 'aria-labelled-by' to it.
        render: (elementId: string) => JSX.Element;
      };

  type AdhocListProps<
    TitleTypographyComponent extends React.ElementType = "span"
  > =
    | {
        type: "unpaginated";
        titleOptions: TitleOptions<TitleTypographyComponent>;
        hasRefresh?: boolean;
        iconAndTextSize?: Size;
        tableCaption: string;
        getDataObservable: () => Observable<DataShape[]>;
        children: React.ReactElement<
          AdhocListColumnProps<DataShape, any, any, any>
        >[];
      }
    | {
        type: "paginated";
        titleOptions: TitleOptions<TitleTypographyComponent>;
        iconAndTextSize?: Size;
        hasRefresh?: boolean;
        pagesNIndexed: 0 | 1;
        defaultSize: number;
        tableCaption: string;
        paginationOptions?: number[] | number;
        getDataObservable: (params: {
          size: number;
          page: number;
        }) => Observable<{
          data: DataShape[];
          total: number;
        }>;
        children: React.ReactElement<
          AdhocListColumnProps<DataShape, any, any, any>
        >[];
      };
  const AdhocList = <
    TitleTypographyComponent extends React.ElementType = "span"
  >(
    props: AdhocListProps<TitleTypographyComponent>
  ) => {
    const { iconAndTextSize = "md", titleOptions } = props;
    const initialTitleId = useMemo(() => uniqueId("list-title-label"), []);
    const titleId = useRef(initialTitleId);
    const classes = useStyles();
    const [state, setState] = useState<
      RemoteData<
        AjaxError,
        {
          data: DataShape[];
          total: number;
        }
      >
    >(initial);

    const [paginationState, dispatch] = usePagination(
      props.type === "paginated" ? props.pagesNIndexed : 0,
      props.type === "paginated" ? props.defaultSize : undefined
    );

    const fetchData = useCallback(() => {
      const handleError = (error: AjaxError) => {
        setState(failure(error));
      };
      setState(pending);
      const subscription =
        props.type === "paginated"
          ? props
              .getDataObservable(paginationState)
              .subscribe(({ data, total }) => {
                setState(
                  success({
                    data,
                    total,
                  })
                );
              }, handleError)
          : props.getDataObservable().subscribe((res) => {
              setState(
                success({
                  data: res,
                  total: res.length,
                })
              );
            }, handleError);
      return () => {
        if (!subscription.closed) {
          subscription.unsubscribe();
        }
      };
      // eslint seems to be having trouble due to the type discrimination I'm doing.
      // (It demands I pass 'props'.) Lets just eyeball that this is correct.
    }, [setState, props.type, props.getDataObservable, paginationState]);

    useEffect(() => {
      return fetchData();
    }, []); // eslint-disable-line
    useEffect(() => {
      return fetchData();
    }, [paginationState.page, paginationState.size]); // eslint-disable-line

    const TableProps: Partial<TableProps> = useMemo((): Partial<TableProps> => {
      if (
        titleOptions.type === "Typography" ||
        titleOptions.type === "aria-labelled-by" ||
        titleOptions.type === "render"
      ) {
        return {
          "aria-labelledby": titleId.current,
        };
      }
      return {
        "aria-label": titleOptions.text,
      };
    }, []);
    const renderTable = (state: { data: DataShape[]; total: number }) => {
      const { data, total } = state;
      return (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {titleOptions.type === "Typography" ? (
              <Typography
                id={titleId.current}
                {...titleOptions.TypographyProps}
              >
                {titleOptions.text}
              </Typography>
            ) : titleOptions.type === "aria-labelled-by" ||
              titleOptions.type === "aria-label" ? null : (
              titleOptions.render(titleId.current)
            )}
            {props.hasRefresh && (
              <div>
                <IconButton aria-label="Refresh" onClick={fetchData}>
                  <Refresh />
                </IconButton>
              </div>
            )}
          </div>
          <Table {...TableProps}>
            <caption className={classes.offScreen}>
              {props.tableCaption}
            </caption>
            <TableHead>
              <TableRow>
                {React.Children.map(props.children, (c, i) =>
                  c.props.hideColTitle ? (
                    <TableCell key={i}>
                      <span className={classes.offScreen}>{c.props.title}</span>
                    </TableCell>
                  ) : (
                    <TableCell key={i}>{c.props.title}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((rowData, i) => (
                <rowContext.Provider
                  key={i}
                  value={{
                    rowData,
                    i,
                  }}
                >
                  <TableRow>
                    {React.Children.map(props.children, (c, i) =>
                      i === 0 ? React.cloneElement(c, { firstColumn: true }) : c
                    )}
                  </TableRow>
                </rowContext.Provider>
              ))}
            </TableBody>
          </Table>
          {props.type === "paginated" && (
            <Pagination
              page={paginationState.page + (props.pagesNIndexed === 0 ? 1 : 0)}
              perPage={paginationState.size}
              setPage={(page: number) => {
                dispatch({
                  type: "SET_PAGE",
                  page: props.pagesNIndexed === 0 ? page - 1 : page,
                });
              }}
              setPerPage={(size: number) => {
                dispatch({
                  type: "SET_SIZE",
                  size,
                });
              }}
              rowsPerPageOptions={(() => {
                if (props.paginationOptions) {
                  if (typeof props.paginationOptions === "number") {
                    return [props.paginationOptions];
                  }
                  return props.paginationOptions;
                }
                const drpp = [5, 10, 25, 100];
                if (drpp.includes(props.defaultSize)) {
                  return drpp;
                }
                return [props.defaultSize, ...drpp].sort();
              })()}
              total={total}
            />
          )}
        </>
      );
    };
    return (
      <>
        <HiddenAriaLive remoteData={state} />
        {fold<
          AjaxError,
          {
            data: DataShape[];
            total: number;
          },
          JSX.Element
        >(
          () => <Pending size={iconAndTextSize} />,
          () => <Pending size={iconAndTextSize} />,
          (error) =>
            error.status ? (
              <ServerError
                size={iconAndTextSize}
                code={error.status}
                message={error.message}
              />
            ) : (
              <NetworkUnavailable size={iconAndTextSize} retry={fetchData} />
            ),
          renderTable
        )(state)}
      </>
    );
  };
  return {
    AdhocList,
    AdhocListColumn,
  };
};
export default makeAdhocList;
