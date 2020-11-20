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
      invalid
      accessToken
      refreshToken
      expiresAt
    }
  }
`;

const handleTokens = (cache, typename) => tokens => {
  const { accessToken, refreshToken, expiresAt } = tokens;
  const data = {
    __typename: typename,
    auth: {
      __typename: "Auth",
      invalid: false,
      accessToken,
      refreshToken,
      expiresAt,
    },
  };

  cache.writeData({ data });

  return data;
};

const handleError = (cache, typename) =>
  when(UnauthorizedError, error => {
    const data = {
      __typename: typename,
      auth: {
        __typename: "Auth",
        invalid: true,
      },
    };

    cache.writeData({ data });

    throw error;
  });

export default {
  defaults: {
    auth: {
      __typename: "Auth",
      invalid: false,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    },
  },
  resolvers: {
    Mutation: {
      createTokens: (_, { username, password }, { cache }) =>
        createTokens(cache, {
          username,
          password,
        }).then(
          handleTokens(cache, "CreateTokensMutation"),
          handleError(cache, "CreateTokensMutation"),
        ),

      setTokens: (_, { accessToken, refreshToken, expiresAt: expiresArg }, { cache }) => {
        const expiresAt = new Date(expiresArg).toString();
        const data = {
          auth: {
            __typename: "Auth",
            invalid: false,
            accessToken,
            refreshToken,
            expiresAt,
          },
        };

        cache.writeData({ data });
      },

      refreshTokens: (_, { notBefore = null }, { cache }) => {
        const result = cache.readQuery({ query });

        if (notBefore !== null && Number.isNaN(new Date(notBefore))) {
          throw new TypeError(
            "invalid `notBefore` variable. Expected DateTime",
          );
        }

        if (result.auth.invalid) {
          return {
            __typename: "RefreshTokensMutation",
            auth: {
              ...result.auth,
              accessToken: null,
            },
          };
        }

        // When no refresh token is present, there is nothing to be done.
        if (!result.auth.refreshToken) {
          return {
            __typename: "RefreshTokensMutation",
            auth: {
              ...result.auth,
            },
          };
        }

        const expired =
          !notBefore ||
          !result.auth.expiresAt ||
          new Date(notBefore) > new Date(result.auth.expiresAt);

        if (!expired) {
          return {
            __typename: "RefreshTokensMutation",
            ...result,
          };
        }

        return refreshTokens(cache, result.auth).then(
          handleTokens(cache, "RefreshTokensMutation"),
          handleError(cache, "RefreshTokensMutation"),
        );
      },

      invalidateTokens: (_, vars, { cache }) => {
        const result = cache.readQuery({ query });

        // Reset all data in the client cache.
        cache.reset();

        return invalidateTokens(cache, result.auth).then(
          handleTokens(cache, "InvalidateTokensMutation"),
        );
      },

      flagTokens: (_, vars, { cache }) => {
        const data = {
          auth: {
            __typename: "Auth",
            invalid: true,
          },
        };
        cache.writeData({ data });

        return null;
      },
    },
  },
};
