import * as React from "react";
import useFilterParams from "./useFilterParams";

type Filter = string | undefined;

type SetFilterAction = Filter | ((prevFilter: Filter) => Filter);

type FilterParamHook = [Filter, (action: SetFilterAction) => void];

function useFilterParam(key: string): FilterParamHook {
  const [filters, setFilters] = useFilterParams();

  const filterRef = React.useRef<Filter>();
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

export default useFilterParam;
