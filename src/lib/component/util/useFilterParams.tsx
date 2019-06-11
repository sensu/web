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

const DEFAULT_KEY = "filter";

// Memoize the most recent call to `parseFilterMap`
let _cache: FilterMap = {};
let _cacheKey = "";

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

function useFilterParams(paramKey: string = DEFAULT_KEY): FilterParamsHook {
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
