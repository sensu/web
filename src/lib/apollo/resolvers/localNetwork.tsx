import { ApolloCache } from "apollo-cache";

interface Context {
  cache: ApolloCache<unknown>;
}

export const setOffline = (
  cache: ApolloCache<unknown>,
  offline: boolean,
): void => {
  const data = {
    localNetwork: {
      __typename: "LocalNetwork",
      offline,
      retry: false,
    },
  };

  cache.writeData({ data });
};

export default {
  defaults: {
    localNetwork: {
      __typename: "LocalNetwork",
      offline: false,
      retry: false,
    },
  },
  resolvers: {
    Mutation: {
      retryLocalNetwork: (
        _: unknown,
        args: unknown,
        { cache }: Context,
      ): null => {
        const data = {
          localNetwork: {
            __typename: "LocalNetwork",
            retry: true,
          },
        };
        cache.writeData({ data });
        return null;
      },
      setLocalNetworkOffline: (
        _: unknown,
        { offline }: { offline: boolean },
        { cache }: Context,
      ): null => {
        setOffline(cache, offline);
        return null;
      },
    },
  },
};
