import { BatchHttpLink } from "/vendor/apollo-link-batch-http";
import { ApolloLink } from "apollo-link";

import { FailedError, ServerError } from "/lib/error/FetchError";
import fetch from "/lib/util/fetch";

import { setOffline } from "./resolvers/localNetwork";

export default new ApolloLink((operation) => {
  const { cache } = operation.getContext();

  const httpLink = new BatchHttpLink({
    uri: "/graphql",
    fetch,
    credentials: "same-origin",
    batchMax: 10,
    batchInterval: 3,
  });

  const observable = httpLink.request(operation);

  if (!observable) {
    return null;
  }

  observable.subscribe(
    () => setOffline(cache, false),
    (error) => {
      if (
        error instanceof FailedError ||
        (error instanceof ServerError && error.statusCode >= 502)
      ) {
        setOffline(cache, true);
      }
    },
  );

  return observable.map((value) => {
    if (value.data === null) {
      // 🚨HACK ALERT🚨
      // Apollo internals fail hard if `data` is ever null or undefined.
      // Replacing `null` with an empty object prevents Apollo from throwing
      // "TypeError: Cannot read property namespace of null" in the event
      // that the GraphQL API returns an error response with no data and
      // allows the underlying GraphQL errors to surface as expected.
      return { ...value, data: {} };
    }
    return value;
  });
});
