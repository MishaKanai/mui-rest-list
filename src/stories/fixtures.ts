/*
  Static fixture data for the version-comparison stories.

  Everything here is derived from the row index — no network, no Math.random, no Date — so a
  story renders byte-identically on every load and on every MUI major. That is what makes a
  2.x-vs-3.x screenshot comparison meaningful: any difference you see is MUI, not data.
*/
import { NEVER, Observable, of, throwError } from "rxjs";
import get from "lodash.get";
import { AjaxError } from "rxjs/ajax";
import { Order } from "../components/makeAdhocList";

export type Person = {
  id: string;
  name: string;
  role: string;
  department: string;
  score: { value: number; grade: string };
};

const FIRST = [
  "Ada",
  "Grace",
  "Alan",
  "Edsger",
  "Barbara",
  "Donald",
  "Ken",
  "Dennis",
  "Linus",
  "Margaret",
  "John",
  "Katherine",
];
const LAST = [
  "Lovelace",
  "Hopper",
  "Turing",
  "Dijkstra",
  "Liskov",
  "Knuth",
  "Thompson",
  "Ritchie",
  "Torvalds",
  "Hamilton",
  "McCarthy",
  "Johnson",
];
const ROLES = ["Engineer", "Analyst", "Designer", "Manager"];
const DEPARTMENTS = ["Platform", "Records", "Intake", "Reporting"];
const GRADES = ["A", "B", "C", "D"];

/** 42 rows: enough for 5 pages at size 10, with a short last page. */
export const PEOPLE: Person[] = Array.from({ length: 42 }, (_, i) => ({
  id: `P-${String(i + 1).padStart(3, "0")}`,
  name: `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`,
  role: ROLES[i % ROLES.length],
  department: DEPARTMENTS[(i * 3) % DEPARTMENTS.length],
  score: { value: ((i * 37) % 100) + 1, grade: GRADES[i % GRADES.length] },
}));

// Deliberately not localeCompare: collation is environment-dependent, and these stories exist
// to be compared across two runs.
const compare = (a: unknown, b: unknown): number => {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  const sa = String(a);
  const sb = String(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
};

/**
 * `order[0]` is a dotted path once a header has been clicked, but the raw `fieldKey` (which may
 * be an array) when it came from `initialSort`. lodash.get takes either.
 */
export const sortRows = <T>(rows: T[], order?: Order): T[] => {
  if (!order) {
    return rows;
  }
  const [field, direction] = order;
  const sorted = [...rows].sort((x, y) =>
    compare(get(x, field as string), get(y, field as string))
  );
  return direction === "desc" ? sorted.reverse() : sorted;
};

export const unpaginatedPeople = (params?: {
  orderBy?: Order;
}): Observable<Person[]> => of(sortRows(PEOPLE, params?.orderBy ?? undefined));

/**
 * `page` arrives 0- or 1-based depending on the list's `pagesNIndexed`, so the story has to say
 * which it used. A `total` larger than the fixture wraps the rows, so pages deep into a
 * synthetic count still have content (used by the maxExactTotalCount story).
 */
export const paginatedPeople =
  (opts: { pagesNIndexed: 0 | 1; total?: number }) =>
  (params: {
    orderBy?: Order;
    size: number;
    page: number;
  }): Observable<{ data: Person[]; total: number }> => {
    const sorted = sortRows(PEOPLE, params.orderBy ?? undefined);
    const total = opts.total ?? sorted.length;
    const start = (params.page - opts.pagesNIndexed) * params.size;
    const count = Math.max(0, Math.min(params.size, total - start));
    const data = Array.from(
      { length: count },
      (_, k) => sorted[(start + k) % sorted.length]
    );
    return of({ data, total });
  };

export type NameFilter = { name: string };

export const filteredPeople =
  (opts: { pagesNIndexed: 0 | 1 }) =>
  (params: {
    orderBy?: Order;
    filter: NameFilter;
    size: number;
    page: number;
  }): Observable<{ data: Person[]; total: number }> => {
    const needle = params.filter.name.trim().toLowerCase();
    const matched = sortRows(PEOPLE, params.orderBy ?? undefined).filter((p) =>
      needle ? p.name.toLowerCase().indexOf(needle) !== -1 : true
    );
    const start = (params.page - opts.pagesNIndexed) * params.size;
    return of({
      data: matched.slice(start, start + params.size),
      total: matched.length,
    });
  };

export const emptyUnpaginated = (): Observable<Person[]> => of([]);
export const emptyPaginated = (): Observable<{
  data: Person[];
  total: number;
}> => of({ data: [], total: 0 });

/** Never emits, so the list stays in its pending state for as long as you look at it. */
export const pendingForever = <T>(): Observable<T> => NEVER;

// `status` drives which state the list picks: truthy -> ServerError, falsy -> NetworkUnavailable.
const ajaxError = (status: number, message: string): AjaxError =>
  ({ status, message, name: "AjaxError" } as unknown as AjaxError);

export const failServerError = <T>(): Observable<T> =>
  throwError(ajaxError(500, "Internal Server Error"));
export const failNotFound = <T>(): Observable<T> =>
  throwError(ajaxError(404, "ajax error 404"));
export const failNetworkDown = <T>(): Observable<T> =>
  throwError(ajaxError(0, "Network request failed"));
