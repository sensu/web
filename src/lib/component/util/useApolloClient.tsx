import * as React from "react";

import { ApolloContext } from "react-apollo";

import { ApolloClient } from "apollo-client";

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
