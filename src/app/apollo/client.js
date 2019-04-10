import { createClient } from "/lib/apollo";

import introspectionURL from "./schema/introspectionRequest.macro";
import introspectionQueryResultData from "./schema/apolloIntrospection.macro";

export default () => {
  const client = createClient({
    introspectionURL,
    introspectionQueryResultData,
  });

  return client;
};
