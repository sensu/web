import gql from "graphql-tag";
import { fetchNamespaces } from "/lib/util/namespaceAPI";

const query = gql`
  query CuratedNamespacesResolverQuery {
    auth @client {
      accessToken
    }
  }
`;

export default {
  resolvers: {
    Query: {
      curatedNamespaces(_obj: null, _args: {}, { cache }: any) {
        const { auth } = cache.readQuery({ query });

        return fetchNamespaces(auth)
          .then((result) => {
            if (Array.isArray(result)) {
              return result.reduce(
                (acc, ns) => [...acc, { __typename: "Namespace", ...ns }],
                [],
              );
            }
            return [];
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(
              "curatedNamespaces resolver was unable to fetch namespaces from the API.",
              err,
            );
            return [];
          });
      },
    },
  },
};
