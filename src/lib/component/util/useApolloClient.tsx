import * as React from "/vendor/react";

import { ApolloContext } from "/vendor/react-apollo";
import { ApolloClient } from "/vendor/apollo-client";

type NotNull<T> = T extends null ? never : T;

function getContext(): NotNull<typeof ApolloContext> {
  if (ApolloContext === null) {
    throw new Error("ApolloContext is null");
  }
  return ApolloContext;
}

function useApolloClient(): ApolloClient<any> {
  const context = React.useContext(getContext());

  if (!context || !context.client) {
    throw new Error("useApolloClient must be used within ApolloProvider");
  }

  return context.client;
}

export default useApolloClient;
