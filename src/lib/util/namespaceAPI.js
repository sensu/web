import gql from "/vendor/graphql-tag";

import {
  createTokens,
  invalidateTokens,
  refreshTokens,
} from "/lib/util/authAPI";
import { when } from "/lib/util/promise";
import { UnauthorizedError } from "/lib/error/FetchError";

const query = gql`
  query AuthQuery {
    auth @client {
      accessToken
      refreshToken
      expiresAt
    }
  }
`;

export const fetchNamespaces = ({ accessToken, refreshToken }) => {
  const path = "/user-namespaces";
  const config = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  };
  return fetch(path, config)
    .catch(when(UnauthorizedError, () => {}))
    .then(() => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    }));
};
