import * as React from "react";

import gql from "/vendor/graphql-tag";

import shallowEqual from "fbjs/lib/shallowEqual";

import {
  WatchQueryOptions,
  OperationVariables,
  ApolloClient,
  ObservableQuery,
  NetworkStatus,
  ApolloError,
} from "apollo-client";

import QueryAbortedError from "/lib/error/QueryAbortedError";

import useApolloClient from "./useApolloClient";

// export type OperationVariables = { [key: string]: any };
interface UseQueryConfig<V> extends WatchQueryOptions<V> {
  client: ApolloClient<any>;
  onError(error: Error): void;
}

export type UseQueryOptions<V> = Optional<
  UseQueryConfig<V>,
  "onError" | "client"
>;

interface ObservableState<T, V> {
  observable: ObservableQuery<T, V>;
  data: T | {};
  loading: boolean;
  networkStatus: NetworkStatus;

  fetchMore: ObservableQuery<T, V>["fetchMore"];
  refetch: ObservableQuery<T, V>["refetch"];
  startPolling: ObservableQuery<T, V>["startPolling"];
  stopPolling: ObservableQuery<T, V>["stopPolling"];
  subscribeToMore: ObservableQuery<T, V>["subscribeToMore"];
  updateQuery: ObservableQuery<T, V>["updateQuery"];
}

function getObservableState<T, V>(
  observable: ObservableQuery<T, V>,
): ObservableState<T, V> {
  const { data, loading, networkStatus } = observable.currentResult();

  return {
    observable,
    data,
    loading,
    networkStatus,

    refetch: observable.refetch,
    fetchMore: observable.fetchMore,
    updateQuery: observable.updateQuery,
    startPolling: observable.startPolling,
    stopPolling: observable.stopPolling,
    subscribeToMore: observable.subscribeToMore,
  };
}

export interface UseQueryResult<T, V> extends ObservableState<T, V> {
  aborted: boolean;
  error: Error | null;
  resubscribe(): void;
}

function staticOptionsHaveChanged(
  a: UseQueryOptions<any>,
  b: UseQueryOptions<any>,
): boolean {
  return a.client !== b.client || a.query !== b.query;
}

function modifiableOptionsHaveChanged(
  a: UseQueryOptions<any>,
  b: UseQueryOptions<any>,
): boolean {
  return (
    a.pollInterval !== b.pollInterval ||
    a.fetchPolicy !== b.fetchPolicy ||
    a.errorPolicy !== b.errorPolicy ||
    a.fetchResults !== b.fetchResults ||
    a.notifyOnNetworkStatusChange !== b.notifyOnNetworkStatusChange ||
    !shallowEqual(a.variables, b.variables)
  );
}

function bindObservableMethods(observable: ObservableQuery<any, any>): void {
  observable.refetch = observable.refetch.bind(observable);
  observable.fetchMore = observable.fetchMore.bind(observable);
  observable.updateQuery = observable.updateQuery.bind(observable);
  observable.startPolling = observable.startPolling.bind(observable);
  observable.stopPolling = observable.stopPolling.bind(observable);
  observable.subscribeToMore = observable.subscribeToMore.bind(observable);
}

const defaultOptions = {
  onError: (error: any): never => {
    if (error !== null && typeof error === "object") {
      throw error;
    }
    throw new Error(error);
  },
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

function useQuery<T, V = OperationVariables>(
  options: UseQueryOptions<V>,
): UseQueryResult<T, V> {
  const configRef = React.useRef<UseQueryConfig<V>>(
    // Prevent typescript from defining configRef as maybe undefined. This is
    // safe as long as we immediately set configRef.current below.
    (undefined as any) as UseQueryConfig<V>,
  );
  configRef.current = {
    // Default to using client from the context, otherwise use what is provided.
    client: useApolloClient(),
    ...defaultOptions,
    ...options,
  };

  const observableRef = React.useRef<ObservableQuery<T, V> | null>(null);
  const subscriptionRef = React.useRef<ZenObservable.Subscription | null>(null);
  const prevConfigRef = React.useRef<UseQueryConfig<V> | null>(null);

  if (prevConfigRef.current !== null && observableRef.current !== null) {
    if (staticOptionsHaveChanged(configRef.current, prevConfigRef.current)) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("Observable query discarded due to options change.");
      }
      // If the client or query have changed, discard the current observable so
      // that it will be re-instantiated  by calling reSubcribe below.
      observableRef.current = null;
    } else if (
      modifiableOptionsHaveChanged(configRef.current, prevConfigRef.current)
    ) {
      // Certain options can be modified without discarding the observable.
      observableRef.current.setOptions(configRef.current);
    }
  }

  const resubscribe = React.useCallback((): void => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // The query observable is not yet created or has been discarded due to
    // changed options.
    const observable = configRef.current.client.watchQuery(configRef.current);
    observableRef.current = observable;
    bindObservableMethods(observable);

    subscriptionRef.current = observable.subscribe({
      next: (value): void => {
        const { data, errors, loading, networkStatus } = value;

        let error: Error | null = null;

        if (errors && errors.length > 0) {
          error = new ApolloError({ graphQLErrors: errors });
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setResult(
          (result): UseQueryResult<T, V> => ({
            ...result,
            aborted: false,
            error,
            data,
            loading,
            networkStatus,
          }),
        );

        if (error) {
          if (configRef.current.onError) {
            configRef.current.onError(error);
          } else {
            throw error;
          }
        }
      },
      error: (error: any): void => {
        // Check if the error is the result of an aborted fetch, don't call the
        // provided onError callback in this case.
        if ((error as ApolloError).networkError instanceof QueryAbortedError) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          setResult(
            (result): UseQueryResult<T, V> => ({
              ...result,
              aborted: true,
              error: null,
            }),
          );
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          setResult((result): UseQueryResult<T, V> => ({ ...result, error }));
          if (configRef.current.onError) {
            configRef.current.onError(error);
          } else {
            throw error;
          }
        }
      },
    });
  }, []);

  if (observableRef.current === null) {
    resubscribe();
  }

  const [result, setResult] = React.useState(
    (): UseQueryResult<T, V> => ({
      ...getObservableState(observableRef.current as ObservableQuery<T, V>),
      error: null,
      aborted: false,
      resubscribe,
    }),
  );

  // Unsubscribe from the current query when the component unmounts
  React.useEffect(
    (): (() => void) => (): void => {
      (subscriptionRef.current as ZenObservable.Subscription).unsubscribe();
    },
    [],
  );

  // Update the config ref last - after any comparisons have alredy been made.
  prevConfigRef.current = configRef.current;

  return result;
}

const localNetworkStatusQuery = gql`
  query LocalNetworkStatusQuery {
    localNetwork @client {
      offline
      retry
    }
  }
`;

function useLocalNetworkAwareQuery<T, V = OperationVariables>(
  options: UseQueryOptions<V>,
): UseQueryResult<T, V> {
  // Create an additional query subscription to observe the local network
  // connection state.
  const localNetworkStatus = useQuery<any>({
    query: localNetworkStatusQuery,
    onError: options.onError,
  });
  const prevOfflineRef = React.useRef<boolean>(false);

  const {
    data: { localNetwork: { offline = false, retry = false } = {} } = {},
  } = localNetworkStatus;

  const result = useQuery<T, V>(options);
  // The react-hooks/exhaustive-deps lint rule considers `result` a dependency
  // even if we only reference the `result.resubscribe` property. Storing
  // it under it's own identifier avoids this problem without having to disable
  // the lint rule.
  const resubscribe = result.resubscribe;
  const error = result.error;

  // Automatically resubscribe in response to on changes in the local network
  // connection state.
  React.useEffect((): void => {
    if (prevOfflineRef.current && (!offline || retry)) {
      resubscribe();
    }
  }, [offline, retry, resubscribe, error]);

  // Update previous value refs last.
  prevOfflineRef.current = offline;

  return result;
}

export default useLocalNetworkAwareQuery;
