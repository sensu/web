import { ApolloLink } from "/vendor/apollo-link";
import gql from "/vendor/graphql-tag";
import merge from "/vendor/deepmerge";

import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "/vendor/apollo-cache-inmemory";
import ApolloClient from "/vendor/apollo-client";
import { setContext } from "/vendor/apollo-link-context";

import createHttpLink from "./httpLink";
import createIntrospectionLink from "./introspectionLink";
import createTokenRefreshLink from "./tokenRefreshLink";
import localStorageSync from "./localStorageSync";

import authResolver from "./resolvers/auth";
import lastNamespaceResolver from "./resolvers/lastNamespace";
import localNetworkResolver from "./resolvers/localNetwork";
import themeResolver from "./resolvers/theme";
import addDeletedFieldTo from "./resolvers/deleted";

const createClient = ({
  link = [],
  resolvers = [],
  introspectionQueryResultData,
  introspectionURL,
} = {}) => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const cache = new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: object => object.id,
  });

  let client = null;

  const introspectionLink = createIntrospectionLink();
  const tokenRefreshLink = createTokenRefreshLink();
  const httpLink = createHttpLink();

  const clientState = merge.all([
    {},
    authResolver,
    lastNamespaceResolver,
    localNetworkResolver,
    themeResolver,
    addDeletedFieldTo("CheckConfig"),
    addDeletedFieldTo("Entity"),
    addDeletedFieldTo("Event"),
    addDeletedFieldTo("Silenced"),
    ...resolvers,
  ]);

  const writeDefaults = () => {
    cache.writeData({ data: clientState.defaults });
  };

  const contextLink = setContext(() => ({
    stateLink: { writeDefaults },
    client,
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

  writeDefaults();

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
