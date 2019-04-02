import gql from "graphql-tag";

const query = gql`
  query ThemeQuery {
    theme @client {
      dark
    }
  }
`;

export default {
  defaults: {
    theme: {
      __typename: "Theme",
      dark: false,
      theme: "sensu",
    },
  },
  resolvers: {
    Mutation: {
      setTheme: (_, { theme }, { cache }) => {
        const data = {
          theme: {
            __typename: "Theme",
            theme,
          },
        };
        cache.writeData({ data });

        return null;
      },

      toggleDark: (_, __, { cache }) => {
        const result = cache.readQuery({ query });

        const data = {
          theme: {
            __typename: "Theme",
            dark: !result.theme.dark,
          },
        };
        cache.writeData({ data });

        return null;
      },
    },
  },
};
