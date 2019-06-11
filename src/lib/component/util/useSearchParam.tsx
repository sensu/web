import * as React from "react";
import useSearchParams from "./useSearchParams";

type SearchParam = string | string[] | undefined;

type SetSearchParamAction =
  | SearchParam
  | ((prevSearchParam: SearchParam) => SearchParam);

type SearchParamHook = [SearchParam, (action: SetSearchParamAction) => void];

function useSearchParam(key: string): SearchParamHook {
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

export default useSearchParam;
