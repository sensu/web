import { ApolloLink } from "/vendor/apollo-link";
import gql from "/vendor/graphql-tag";

import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "/vendor/apollo-cache-inmemory";
import ApolloClient from "/vendor/apollo-client";
import { setContext } from "/vendor/apollo-link-context";

import createHttpLink from "./httpLink";
import createIntrospectionLink from "./introspectionLink";
import createTokenRefreshLink from "./tokenRefreshLink";
import createStateLink from "./stateLink";
import localStorageSync from "./localStorageSync";

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

  const stateLink = createStateLink({ resolvers, cache });

  const contextLink = setContext(() => ({
    stateLink,
    client,
    introspectionURL,
  }));

  client = new ApolloClient({
    cache,
    link: ApolloLink.from([
      contextLink,
      stateLink,
      introspectionLink,
      tokenRefreshLink,
      ...link,
      httpLink,
    ]),
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
