import React from "/vendor/react";
import {
  ApolloError,
  ObservableQuery,
  OperationVariables,
  ApolloClient,
  WatchQueryOptions,
  NetworkStatus,
  ApolloQueryResult,
} from "apollo-client";
import { withApollo } from "/vendor/react-apollo";
import shallowEqual from "fbjs/lib/shallowEqual";
import gql from "/vendor/graphql-tag";

import QueryAbortedError from "/lib/error/QueryAbortedError";

interface ObservableMethods<T = any, V = OperationVariables> {
  fetchMore: ObservableQuery<T, V>["fetchMore"];
  refetch: ObservableQuery<T, V>["refetch"];
  startPolling: ObservableQuery<T, V>["startPolling"];
  stopPolling: ObservableQuery<T, V>["stopPolling"];
  subscribeToMore: ObservableQuery<T, V>["subscribeToMore"];
  updateQuery: ObservableQuery<T, V>["updateQuery"];
}

interface Props extends WatchQueryOptions {
  client: ApolloClient<unknown>;
  // eslint-disable-next-line no-use-before-define
  children: (state: State) => React.ReactNode;
  onError: (error: Error) => void;
}

interface LocalData {
  localNetwork: {
    offline: boolean;
    retry: boolean;
  };
}

interface ObservableState<T = any, V = OperationVariables> {
  observable: ObservableQuery<T, V>;
  data: T;
  loading: boolean;
  networkStatus: NetworkStatus;
}

interface State extends ObservableState, ObservableMethods {
  aborted: boolean;
  error: Error | null;
  localQuery: {
    observable: ObservableQuery<LocalData>;
    data: LocalData;
  };
  props: Props;
}

const modifiableWatchQueryOptionsHaveChanged = (
  a: WatchQueryOptions,
  b: WatchQueryOptions,
): boolean =>
  a.pollInterval !== b.pollInterval ||
  a.fetchPolicy !== b.fetchPolicy ||
  a.errorPolicy !== b.errorPolicy ||
  a.fetchResults !== b.fetchResults ||
  a.notifyOnNetworkStatusChange !== b.notifyOnNetworkStatusChange ||
  !shallowEqual(a.variables, b.variables);

const extractQueryOptions = (props: WatchQueryOptions): WatchQueryOptions => ({
  variables: props.variables,
  pollInterval: props.pollInterval,
  query: props.query,
  fetchPolicy: props.fetchPolicy,
  errorPolicy: props.errorPolicy,
  notifyOnNetworkStatusChange: props.notifyOnNetworkStatusChange,
});

const localQuery = gql`
  query LocalNetworkStatusQuery {
    localNetwork @client {
      offline
      retry
    }
  }
`;

const createQueryObservable = (
  props: Props,
): ObservableMethods & ObservableState => {
  const observable: ObservableQuery = props.client.watchQuery(
    extractQueryOptions(props),
  );

  // retrieve the result of the query from the local cache
  const { data, loading, networkStatus } = observable.currentResult();

  return {
    observable,
    data,
    loading,
    networkStatus,
    refetch: observable.refetch.bind(observable),
    fetchMore: observable.fetchMore.bind(observable),
    updateQuery: observable.updateQuery.bind(observable),
    startPolling: observable.startPolling.bind(observable),
    stopPolling: observable.stopPolling.bind(observable),
    subscribeToMore: observable.subscribeToMore.bind(observable),
  };
};

class Query extends React.PureComponent<Props, State> {
  public static defaultProps = {
    variables: {},
    pollInterval: 0,
    children: (): null => null,
    onError: (error: Error): void => {
      throw error;
    },
  };

  private subscription: { unsubscribe(): void } | null = null;

  private localSubscription: { unsubscribe(): void } | null = null;

  public static getDerivedStateFromProps(
    props: Props,
    state: State | null,
  ): State | null {
    if (state !== null && state.props === props) {
      return null;
    }

    let nextState: Partial<State> = { props };

    if (state === null || state.props.client !== props.client) {
      const observable: ObservableQuery<LocalData> = props.client.watchQuery({
        query: localQuery,
      });

      const { data } = observable.currentResult();

      nextState = {
        ...nextState,
        localQuery: {
          observable,
          // flowlint-next-line unclear-type: off
          data: (data as any) as LocalData,
        },
      };
    }

    if (
      state === null ||
      state.props.client !== props.client ||
      state.props.query !== props.query
    ) {
      nextState = {
        ...nextState,
        ...createQueryObservable(props),
      };
    } else if (
      state !== null &&
      modifiableWatchQueryOptionsHaveChanged(state.props, props)
    ) {
      state.observable.setOptions(extractQueryOptions(props));
    }

    // Changes to `metadata` and `context` props are ignored.

    return nextState as State;
  }

  public constructor(props: Props) {
    super(props);
    const state = Query.getDerivedStateFromProps(this.props, null);
    if (state !== null) {
      this.state = state;
    }
  }

  private subscribe(): void {
    if (this.subscription) {
      throw new Error("Cannot subscribe. Currently subscribed.");
    }

    this.subscription = this.state.observable.subscribe({
      next: this.onNext,
      error: this.onError,
    });
  }

  private subscribeLocal(): void {
    if (this.localSubscription) {
      throw new Error("Cannot subscribe. Currently subscribed.");
    }

    this.localSubscription = this.state.localQuery.observable.subscribe({
      next: this.onNextLocal,
      error: this.onErrorLocal,
    });
  }

  private unsubscribe(): void {
    if (!this.subscription) {
      throw new Error("Cannot unsubscribe. Not currently subscribed");
    }

    this.subscription.unsubscribe();
    this.subscription = null;
  }

  private unsubscribeLocal(): void {
    if (!this.localSubscription) {
      throw new Error("Cannot unsubscribe. Not currently subscribed");
    }

    this.localSubscription.unsubscribe();
    this.localSubscription = null;
  }

  private onNext = ({
    data,
    errors,
    loading,
    networkStatus /* stale */,
  }: ApolloQueryResult<unknown>): void => {
    let error = null;

    if (errors && errors.length > 0) {
      error = new ApolloError({ graphQLErrors: errors });
    }

    this.setState({
      aborted: false,
      error,
      data,
      loading,
      networkStatus,
    });

    if (error) {
      this.props.onError(error);
    }
  };

  private onNextLocal = ({ data }: ApolloQueryResult<LocalData>): void => {
    this.setState(
      (state: State, props: Props): State => {
        let nextState = {
          localQuery: {
            ...state.localQuery,
            data,
          },
        };

        if (
          state.localQuery.data.localNetwork.offline &&
          (!nextState.localQuery.data.localNetwork.offline ||
            nextState.localQuery.data.localNetwork.retry)
        ) {
          nextState = {
            ...nextState,
            ...createQueryObservable(props),
          };
        }

        return nextState as State;
      },
    );
  };

  private onError = (error: Error): void => {
    if ((error as any).networkError instanceof QueryAbortedError) {
      this.setState({ aborted: true, error: null });
    } else {
      this.setState({ error });
      this.props.onError(error);
    }
  };

  private onErrorLocal = (error: Error): void => {
    throw error;
  };

  public componentDidMount(): void {
    this.subscribe();
    this.subscribeLocal();
  }

  public componentDidUpdate(previousProps: Props, previousState: State): void {
    if (this.state.observable !== previousState.observable) {
      this.unsubscribe();
      this.subscribe();
    }

    if (
      this.state.localQuery.observable !== previousState.localQuery.observable
    ) {
      this.unsubscribeLocal();
      this.subscribeLocal();
    }
  }

  public componentWillUnmount(): void {
    this.unsubscribe();
    this.unsubscribeLocal();
  }

  public render(): React.ReactNode {
    return this.props.children(this.state);
  }
}

export default withApollo(Query);
