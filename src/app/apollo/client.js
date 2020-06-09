import createClient from "./createClient";

import introspectionURL from "./schema/introspectionRequest.macro";
import introspectionQueryResultData from "./schema/apolloIntrospection.macro";

export default () => {
  const client = createClient({
    introspectionURL,
    introspectionQueryResultData,
  });

  return client;
};
