import * as React from "/vendor/react";

import { SearchParamKey } from "/lib/constant";
import {
  parseFilterParams,
  buildFilterParams,
  FilterParamMap,
  FilterParam,
  FilterParamKey,
} from "/lib/util/filterParams";
import { parseArrayParam } from "/lib/util/params";

import { useSearchParam } from "./useSearchParams";

// defines the allowable type of the argument passed to useFilterParams()[1]
export type SetFilterParamsAction =
  | FilterParamMap
  | ((prevFilters: FilterParamMap) => FilterParamMap);

// defines the return tuple type of useFilterParams()
export type FilterParamsHook = [
  FilterParamMap,
  (action: SetFilterParamsAction) => void
];

// defines the allowable type of the arument passed to useFilterParam()[1]
export type SetFilterAction =
  | FilterParam
  | undefined
  | ((prevFilter?: FilterParam) => FilterParam | undefined);

// defines the return tuple type of useFilterParam()
export type FilterParamHook = [
  FilterParam | undefined,
  (action: SetFilterAction) => void
];

// Memoize the most recent call to `parseFilterMap`
let _cache: FilterParamMap = {};
let _cacheKey = "";

/*
 * parseFilterMap is memoized since it will likely be called many times
 * sequentially with the same value every time the url search params change.
 * This ensures that using `useFilterParams` in many locations at once won't
 * become a performance concern.
 */
function parseFilterMap(filters: string[]): FilterParamMap {
  const cacheKey = filters.map(encodeURIComponent).join("&");

  if (_cacheKey === cacheKey) {
    return _cache;
  }

  const map = parseFilterParams(filters);

  // Prevent accidental mutation of cached result which may be shared between
  // many component instances.
  Object.freeze(map);

  _cacheKey = cacheKey;
  _cache = map;

  return map;
}

/*
 * useFilterParams returns a value and updater tuple. Like React.useState, the
 * updater can be called with a raw value: (FilterMap) or a updater function:
 * ((FilterMap) => FilterMap).
 *
 * The interface provided by this hook gives us a consitent way of interacting
 * with filter params which abstracts the underlying url search param interface
 * through a much nicer map api.
 *
 * Like with React.useState, the return value from a provided updater is not
 * automatically merged. This allows individual filters to be removed by
 * returing `undefined` for a given filter key.
 *
 * examples
 *
 * Removing a filter:
 *
 * ```tsx
 * const [filters, setFilters] = useFilterParams();
 *
 * const remove = (key: string) => setFilters((filters) => ({
 *   ...filters,
 *   [key]: undefined,
 * }));
 * ```
 *
 * Toggling a filter:
 *
 * ```tsx
 * const [filters, setFilters] = useFilterParams();
 *
 * const toggle = (key: string, val?: string) => setFilters((filters) => ({
 *   ...filters,
 *   [key]: filters[key] === val ? undefined : val,
 * }));
 * ```
 *
 * Resetting all filters:
 *
 * ```tsx
 * const [filters, setFilters] = useFilterParams();
 *
 * const reset = () => setFilters({});
 * ```
 *
 */
export function useFilterParams(
  paramKey: SearchParamKey = SearchParamKey.filters,
): FilterParamsHook {
  const [param, setParam] = useSearchParam(paramKey);

  const filterMapRef = React.useRef<FilterParamMap>({});
  filterMapRef.current = parseFilterMap(parseArrayParam(param));

  const setFilters = React.useCallback(
    (action: SetFilterParamsAction) => {
      const nextFilterMap =
        typeof action === "function" ? action(filterMapRef.current) : action;

      const nextFilters = buildFilterParams(nextFilterMap);

      setParam(nextFilters);
    },
    [setParam],
  );

  return [filterMapRef.current, setFilters];
}

/*
 * useFilterParam wraps useFilterParams, binding it to a given filter param key
 */
export function useFilterParam(key: FilterParamKey): FilterParamHook {
  const [filters, setFilters] = useFilterParams();

  const filterRef = React.useRef<FilterParam>();
  filterRef.current = filters[key];

  const setFilter = React.useCallback(
    (action: SetFilterAction) => {
      const nextFilter =
        typeof action === "function" ? action(filterRef.current) : action;

      setFilters((filters) => ({ ...filters, [key]: nextFilter }));
    },
    [key, setFilters],
  );

  return [filterRef.current, setFilter];
}
