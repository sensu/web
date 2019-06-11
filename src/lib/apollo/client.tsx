import { ApolloLink } from "/vendor/apollo-link";
import gql from "/vendor/graphql-tag";

import {
  InMemoryCache,
  InMemoryCacheConfig,
  IntrospectionFragmentMatcher,
  IntrospectionResultData,
} from "/vendor/apollo-cache-inmemory";
import ApolloClient from "/vendor/apollo-client";

import createHttpLink from "./httpLink";
import createIntrospectionLink from "./introspectionLink";
import createTokenRefreshLink from "./tokenRefreshLink";
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

  client = new ApolloClient({
    cache,
    link: ApolloLink.from([
      createIntrospectionLink(introspectionURL),
      createTokenRefreshLink(getClient),
      ...link,
      createHttpLink(),
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
          theme
          dark
        }
      }
    `,
  );

  return client;
};

export default createClient;
