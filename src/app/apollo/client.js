import { createClient } from "/lib/apollo";

import introspectionURL from "./schema/introspectionRequest.macro";
import introspectionQueryResultData from "./schema/apolloIntrospection.macro";
import curatedNamespaces from "./resolvers/curatedNamespaces";

export default () => {
  const client = createClient({
    introspectionURL,
    introspectionQueryResultData,
    resolvers: [curatedNamespaces],
  });

  return client;
};
