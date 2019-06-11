import * as React from "react";
import {
  parseFilterParams,
  buildFilterParams,
  FilterMap,
} from "/lib/util/filterParams";
import { parseArrayParam } from "/lib/util/params";

import useSearchParams from "./useSearchParams";

type SetFiltersAction = FilterMap | ((prevFilters: FilterMap) => FilterMap);

type FilterParamsHook = [FilterMap, (action: SetFiltersAction) => void];

// Memoize the most recent call to `parseFilterMap`
let _cache: FilterMap = {};
let _cacheKey = "";

/*
 * parseFilterMap is memoized since it will likely be called many times
 * sequentially with the same value every time the url search params change.
 * This ensures that using `useFilterParams` in many locations at once won't
 * become a performance concern.
 */
function parseFilterMap(filters: string[]): FilterMap {
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
function useFilterParams(paramKey: string = "filter"): FilterParamsHook {
  const [params, setParams] = useSearchParams();

  const filterMapRef = React.useRef<FilterMap>({});
  filterMapRef.current = parseFilterMap(parseArrayParam(params[paramKey]));

  const setFilters = React.useCallback(
    (action: SetFiltersAction) => {
      const nextFilterMap =
        typeof action === "function" ? action(filterMapRef.current) : action;

      const nextFilters = buildFilterParams(nextFilterMap);

      setParams((params) => ({ ...params, [paramKey]: nextFilters }));
    },
    [setParams, paramKey],
  );

  return [filterMapRef.current, setFilters];
}

export default useFilterParams;
