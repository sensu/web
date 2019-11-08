import * as React from "/vendor/react";

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

interface UseQueryConfig<TVariables> extends WatchQueryOptions<TVariables> {
  client: ApolloClient<any>;
  onError(error: Error): void;
}

export interface UseQueryOptions<TVariables = OperationVariables>
  extends WatchQueryOptions<TVariables> {
  client?: ApolloClient<any>;
  onError?: (error: Error) => void;
}

interface ObservableState<TData, TVariables> {
  observable: ObservableQuery<TData, TVariables>;
  data: TData | {};
  loading: boolean;
  networkStatus: NetworkStatus;

  fetchMore: ObservableQuery<TData, TVariables>["fetchMore"];
  refetch: ObservableQuery<TData, TVariables>["refetch"];
  startPolling: ObservableQuery<TData, TVariables>["startPolling"];
  stopPolling: ObservableQuery<TData, TVariables>["stopPolling"];
  subscribeToMore: ObservableQuery<TData, TVariables>["subscribeToMore"];
  updateQuery: ObservableQuery<TData, TVariables>["updateQuery"];
}

function getObservableState<TData, TVariables>(
  observable: ObservableQuery<TData, TVariables>,
): ObservableState<TData, TVariables> {
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

export interface UseQueryResult<TData, TVariables>
  extends ObservableState<TData, TVariables> {
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

function useQuery<TData = any, TVariables = OperationVariables>(
  options: UseQueryOptions<TVariables>,
): UseQueryResult<TData, TVariables> {
  const configRef = React.useRef<UseQueryConfig<TVariables>>(
    // Prevent typescript from defining configRef as maybe undefined. This is
    // safe as long as we immediately set configRef.current below.
    (undefined as any) as UseQueryConfig<TVariables>,
  );
  configRef.current = {
    // Default to using client from the context, otherwise use what is provided.
    client: useApolloClient(),
    ...defaultOptions,
    ...options,
  };

  const observableRef = React.useRef<ObservableQuery<TData, TVariables> | null>(
    null,
  );
  const subscriptionRef = React.useRef<ZenObservable.Subscription | null>(null);
  const prevConfigRef = React.useRef<UseQueryConfig<TVariables> | null>(null);

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
      observableRef.current
        .setOptions(configRef.current)
        // Any rejection here will also be passed to the query observer below.
        // There is no benefit to handling the error here as well.
        .catch(() => null);
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
          (result): UseQueryResult<TData, TVariables> => ({
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
            (result): UseQueryResult<TData, TVariables> => ({
              ...result,
              aborted: true,
              error: null,
            }),
          );
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          setResult(
            (result): UseQueryResult<TData, TVariables> => ({
              ...result,
              error,
            }),
          );
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
    (): UseQueryResult<TData, TVariables> => ({
      ...getObservableState(observableRef.current as ObservableQuery<
        TData,
        TVariables
      >),
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

function useLocalNetworkAwareQuery<
  TData = any,
  TVariables = OperationVariables
>(options: UseQueryOptions<TVariables>): UseQueryResult<TData, TVariables> {
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

  const result = useQuery<TData, TVariables>(options);
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
