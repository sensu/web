import { ApolloLink } from "apollo-link";
import gql from "graphql-tag";

import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { setContext } from "apollo-link-context";

import createStateLink from "./stateLink";
import createHttpLink from "./httpLink";
import createIntrospectionLink from "./introspectionLink";
import createTokenRefreshLink from "./tokenRefreshLink";
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
  const stateLink = createStateLink({ cache, resolvers });
  const tokenRefreshLink = createTokenRefreshLink();
  const httpLink = createHttpLink();

  const contextLink = setContext(() => ({
    stateLink,
    client,
    introspectionURL,
  }));

  client = new ApolloClient({
    cache,
    link: ApolloLink.from([
      contextLink,
      introspectionLink,
      stateLink,
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
