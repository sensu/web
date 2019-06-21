import * as React from "react";

import { SearchParamKey } from "/lib/constant";

import useRouter from "./useRouter";

// defines the type of a URLSearchParams entry
export type SearchParam = string | string[];

// defines the type of a parsed map of URLSearchParams entries. Keys must be
// members of the SearchParamKey enum.
export type SearchParamsMap = { readonly [K in SearchParamKey]?: SearchParam };

// defines the allowable argument that can be provided to useSearchParams()[1]
export type SetSearchParamsAction =
  | SearchParamsMap
  | ((prevParams: SearchParamsMap) => SearchParamsMap);

// defines the return tuple type of useSearchParams
export type SearchParamsHook = [
  SearchParamsMap,
  (action: SetSearchParamsAction) => void
];

// defines the allowable argument that can be provided to useSearchParam()[1]
export type SetSearchParamAction =
  | SearchParam
  | undefined
  | ((prevSearchParam?: SearchParam) => SearchParam | undefined);

// defines the return value of useSearchParam
export type SearchParamHook = [
  SearchParam | undefined,
  (action: SetSearchParamAction) => void
];

// Memoize the most recent call to `parseSearch`
let _cache: SearchParamsMap = {};
let _cacheKey = "";

/*
 * parseSearch converts a formatted query paramter string to an object
 * representation (SearchParamsMap).
 *
 * All fields are returned as either strings or string arrays.
 */
function parseSearch(search: string): SearchParamsMap {
  if (_cacheKey === search) {
    return _cache;
  }

  const map = {};

  const searchParams = new URLSearchParams(search);

  for (let [key, val] of searchParams.entries()) {
    const prevVal = map[key];
    if (Array.isArray(prevVal)) {
      map[key] = [val, ...prevVal];
    } else if (prevVal !== undefined) {
      map[key] = [val, prevVal];
    } else {
      map[key] = val;
    }
  }

  // Prevent accidental mutation of cached result which may be shared between
  // many component instances.
  Object.freeze(map);

  _cacheKey = search;
  _cache = map;

  return map;
}

/*
 * formatSearch converts a object (SearchParamsMap) to a formatted location
 * search parameter string.
 */
function formatSearch(map: SearchParamsMap): string {
  const searchParams = new URLSearchParams();

  Object.keys(map).forEach((key) => {
    const val = map[key];
    if (Array.isArray(val)) {
      if (val.length > 0) {
        val.forEach((v) => searchParams.append(key, v));
      }
    } else if (val !== "" && val !== undefined) {
      searchParams.set(key, val);
    }
  });

  return searchParams.toString();
}

/*
 * useSearchParams returns a value and updater tuple. Like React.useState, the
 * updater can be called with a raw value (SearchParamsMap) or a function
 * ((SearchParamsMap) => SearchParamsMap). In addition like useState, the update
 * is not automatically merged. Calls to setParams may be aborted by returning
 * the previous value.
 *
 * It is possible to remove all query params by calling `setParams({})`, however
 * this is not recommended as no single component can be considered the owner
 * of the entire location.search state.
 *
 */
export function useSearchParams(): SearchParamsHook {
  const router = useRouter();

  const paramsRef = React.useRef<SearchParamsMap>({});
  paramsRef.current = parseSearch(router.location.search);

  const setParams = React.useCallback(
    (action: SetSearchParamsAction) => {
      const nextParams =
        typeof action === "function" ? action(paramsRef.current) : action;

      if (nextParams === paramsRef.current) {
        // Abort loction change if the same previous params object is returned.
        return;
      }

      const search = formatSearch(nextParams);

      if (search == router.location.search.replace(/^\?/, "")) {
        // Abort loction change if formatted search value is identical.
        return;
      }

      // Update only the `search` property of the current location. All other
      // location properties (`path` etc.) are preserved.
      router.history.push({ search });
    },
    [router.location.search, router.history],
  );

  return [paramsRef.current, setParams];
}

export function useSearchParam(key: SearchParamKey): SearchParamHook {
  const [params, setParams] = useSearchParams();

  const paramRef = React.useRef<SearchParam>();
  paramRef.current = params[key];

  const setParam = React.useCallback(
    (action: SetSearchParamAction) => {
      const nextParam =
        typeof action === "function" ? action(paramRef.current) : action;

      setParams((params) => ({ ...params, [key]: nextParam }));
    },
    [key, setParams],
  );

  return [paramRef.current, setParam];
}
