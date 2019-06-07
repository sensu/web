import * as React from "react";
import useQuery, { UseQueryOptions, UseQueryResult } from "./useQuery";

interface Props<T, V> extends UseQueryOptions<V> {
  children(state: UseQueryResult<T, V>): React.ReactNode;
}

const Query = <T, V>(props: Props<T, V>): React.ReactNode => {
  const result = useQuery<T, V>(props);
  return props.children(result);
};

export default Query;
