export default {
  defaults: {
    lastCluster: null,
    lastNamespace: null,
  },
  resolvers: {
    Mutation: {
      setLastContext: (_, { namespace, cluster }, { cache }) => {
        cache.writeData({
          data: {
            lastCluster: cluster,
            lastNamespace: namespace,
          },
        });

        return null;
      },
      // deprecated
      setLastNamespace: (_, { name }, { cache }) => {
        cache.writeData({
          data: {
            lastNamespace: name,
          },
        });

        return null;
      },
    },
  },
};
