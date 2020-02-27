export default {
  defaults: {
    theme: {
      __typename: "Theme",
      value: "sensu",
      dark: "UNSET",
    },
  },
  resolvers: {
    Mutation: {
      setTheme: (_, { theme }, { cache }) => {
        const data = {
          theme: {
            __typename: "Theme",
            value: theme,
          },
        };
        cache.writeData({ data });

        return null;
      },

      setDarkMode: (_, { value }, { cache }) => {
        const data = {
          theme: {
            __typename: "Theme",
            dark: value,
          },
        };
        cache.writeData({ data });

        return null;
      },
    },
  },
};
