import useQuery, { UseQueryOptions, UseQueryResult } from "./useQuery";

interface Props<T, V> extends UseQueryOptions<V> {
  children(state: UseQueryResult<T, V>): JSX.Element | null;
}

const Query = <T, V>(props: Props<T, V>) => {
  const result = useQuery<T, V>(props);
  return props.children(result);
};

export default Query;
