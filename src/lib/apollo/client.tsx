import { ApolloLink } from "/vendor/apollo-link";
import gql from "/vendor/graphql-tag";

import {
  InMemoryCache,
  InMemoryCacheConfig,
  IntrospectionFragmentMatcher,
  IntrospectionResultData,
} from "/vendor/apollo-cache-inmemory";
import ApolloClient from "/vendor/apollo-client";
import { setContext } from "/vendor/apollo-link-context";

import httpLink from "./httpLink";
import introspectionLink from "./introspectionLink";
import tokenRefreshLink from "./tokenRefreshLink";
import createStateLink from "./stateLink";
import localStorageSync from "./localStorageSync";

interface CustomCacheConfig extends InMemoryCacheConfig {
  defaults?: {};
}

class CustomCache extends InMemoryCache {
  cacheDefaults: {};

  constructor(config: CustomCacheConfig) {
    super(config);

    this.cacheDefaults = config.defaults || {};

    this.writeData({ data: this.cacheDefaults });
  }

  // Override the super `reset` reset function. We don't actually call the super
  // function since it includes a call to `broadcastWatches` which may result in
  // some queries updating before the required defaults are written back to the
  // cache. (`writeData` itself calls `broadcastWatches` when it completes)
  //
  // see original: https://github.com/apollographql/apollo-client/blob/f58fc635cdf324074b31a1978b3a41d3de12f839/packages/apollo-cache-inmemory/src/inMemoryCache.ts#L235-L240
  reset() {
    (this as any).data.clear();
    this.writeData({ data: this.cacheDefaults });
    return Promise.resolve();
  }
}

interface Resolver {
  resolvers: {};
  defaults: {};
}

interface CreateClientConfig {
  link?: ApolloLink[];
  resolvers?: Resolver[];
  introspectionQueryResultData: IntrospectionResultData;
  introspectionURL: string;
}

const createClient = ({
  link = [],
  resolvers = [],
  introspectionQueryResultData,
  introspectionURL,
}: CreateClientConfig) => {
  let client: ApolloClient<any> | null = null;

  function getClient(): ApolloClient<any> {
    if (client === null) {
      throw Error("Apollo client not yet initialized");
    }

    return client;
  }

  const clientState = createStateLink(resolvers) as Resolver;

  const cache = new CustomCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
    dataIdFromObject: (object) => object.id,
    defaults: clientState.defaults,
  });

  const contextLink = setContext(() => ({
    getClient,
    introspectionURL,
  }));

  client = new ApolloClient({
    cache,
    link: ApolloLink.from([
      contextLink,
      introspectionLink,
      tokenRefreshLink,
      ...link,
      httpLink,
    ]),
    resolvers: clientState.resolvers,
  });

  localStorageSync(
    client,
    gql`
      query SyncLastNamespaceQuery {
        lastNamespace @client
      }
    `,
    {
      // To avoid any confusion when multiple tabs are open, ignore updates from
      // other tabs / windows.
      ignoreRemoteUpdates: true,
    },
  );

  localStorageSync(
    client,
    gql`
      query SyncAuthQuery {
        auth @client {
          invalid
          accessToken
          refreshToken
          expiresAt
        }
      }
    `,
  );

  localStorageSync(
    client,
    gql`
      query SyncThemeQuery {
        theme @client {
          value
          dark
        }
      }
    `,
  );

  return client;
};

export default createClient;
