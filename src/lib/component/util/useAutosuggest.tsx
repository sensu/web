import React from "react";
import gql from "graphql-tag";
import throttle from "lodash/throttle";
import useApolloClient from "./useApolloClient";
import { shallowEqual } from "/lib/util/array";
import { ObservableQuery } from "apollo-client";
import { Subscription } from "apollo-client/util/Observable";

type SetVariables = (vars: SuggestVariables) => void;
type ThrottledSetVariables = SetVariables & Cancelable;

interface Cancelable {
  cancel(): void;
}

const gqlQuery = gql`
  query UseAutoSuggestQuery(
    $namespace: String!
    $ref: String!
    $q: String
    $order: SuggestionOrder
    $limit: Int
  ) {
    suggest(
      namespace: $namespace
      ref: $ref
      q: $q
      order: $order
      limit: $limit
    ) {
      values
    }
  }
`;

interface SuggestVariables {
  namespace: string;
  ref: string;
  q: string;
  order?: "ALPHA_DESC" | "ALPHA_ASC" | "FREQUENCY";
  limit?: number;
}

interface UseAutosuggestOptions extends SuggestVariables {
  delay?: number;
}

const useAutosuggest = ({
  namespace,
  ref,
  q,
  order = "ALPHA_DESC",
  limit = 10,
  delay = 2500,
}: UseAutosuggestOptions) => {
  const client = useApolloClient();
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const queryObserver = React.useRef<ObservableQuery<any, any>>();
  const querySubscription = React.useRef<Subscription>();
  const throttledInvoke = React.useRef<ThrottledSetVariables>();

  React.useEffect(() => {
    queryObserver.current = client.watchQuery({
      query: gqlQuery,
      variables: {
        namespace,
        ref,
        q,
        limit,
        order,
      },
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    });

    if (queryObserver.current) {
      querySubscription.current = queryObserver.current.subscribe(
        ({ data, stale }) => {
          if (stale || !data) {
            return;
          }

          const values = data.suggest.values as string[];
          setSuggestions((prevValues) => {
            if (!shallowEqual(prevValues, values)) {
              return values;
            }
            return prevValues;
          });
        },
      );
    }

    throttledInvoke.current = throttle(
      (variables: any) => {
        if (queryObserver.current) {
          queryObserver.current.setVariables(variables);
        }
      },
      delay,
      { leading: false, trailing: true },
    );

    // Ensure that any throttle requests and queries are canceled when the
    // component unmounts.
    return () => {
      if (querySubscription.current) {
        querySubscription.current.unsubscribe();
      }
      if (throttledInvoke.current) {
        throttledInvoke.current.cancel();
      }
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  React.useEffect(() => {
    if (!throttledInvoke.current) {
      return;
    }
    throttledInvoke.current({ namespace, ref, q, limit, order });
  }, [namespace, ref, q, limit, order]);

  return suggestions;
};

export default useAutosuggest;
