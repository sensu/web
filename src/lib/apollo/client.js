import { ApolloLink } from "apollo-link";
import gql from "graphql-tag";

import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { setContext } from "apollo-link-context";

// https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
import { data as introspectionQueryResultData } from "/schema/combinedTypes.macro";

import authLink from "./authLink";
import createStateLink from "./stateLink";
import httpLink from "./httpLink";
import introspectionLink from "./introspectionLink";
import localStorageSync from "./localStorageSync";

const createClient = () => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const cache = new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: object => object.id,
  });

  let client = null;
  const getClient = () => {
    if (!client) {
      throw new Error("apollo client is not initialized");
    }
    return client;
  };

  const stateLink = createStateLink({ cache });

  client = new ApolloClient({
    cache,
    link: ApolloLink.from([
      introspectionLink(),
      setContext(() => ({ stateLink })),
      stateLink,
      authLink({ getClient }),
      httpLink({ getClient }),
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
