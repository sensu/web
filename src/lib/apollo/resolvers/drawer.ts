import { ApolloCache } from "apollo-cache";
import gql from "graphql-tag";

interface Context {
  cache: ApolloCache<unknown>;
}

interface Args {
  minified: boolean;
}

interface QueryResp {
  preferMinDrawer: boolean;
}

const query = gql`
  query GetDrawerPref {
    preferMinDrawer @client
  }
`;

export default {
  defaults: {
    preferMinDrawer: false,
  },
  resolvers: {
    Mutation: {
      toggleDrawerPreference: (_: unknown, __: any, { cache }: Context) => {
        const prev = cache.readQuery({ query }) as QueryResp;
        let newVal = !prev.preferMinDrawer;

        cache.writeQuery({ query, data: { preferMinDrawer: newVal } });
        return true;
      },
      setDrawerPreference: (_: unknown, { minified }: Args, { cache }: Context) => {
        cache.writeData({ data: { preferMinDrawer: minified } });
        return true;
      },
    },
  },
};
