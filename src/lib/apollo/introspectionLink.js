import { ApolloLink, Observable } from "/vendor/apollo-link";

/**
 * Captures introspection queries sent to client and instead of passing along to
 * the server the combined server and client schema is returned.
 *
 * In practice this means the apollo dev tools can not only display the server's
 * schema but any additions the client has made.
 */
export default introspectionUrl =>
  new ApolloLink((operation, forward) => {
    const { operationName } = operation;

    // This is maybe not the most ideal heuristic but the alternative is
    // comparing the given query with the static one included in graphql-js.
    // The query is very large and liable to be brittle as it changes between
    // versions.
    //
    // Works with apollo dev tools aand GraphiQL as they always include the
    // operationName.
    if (operationName !== "IntrospectionQuery") {
      return forward(operation);
    }

    return new Observable(obs => {
      fetch(introspectionUrl)
        .then(response => {
          operation.setContext({ response });
          return response;
        })
        .then(response => response.json())
        .then(response => {
          obs.next(response);
          obs.complete();
          return response;
        })
        .catch(err => obs.error(err));

      return () => {};
    });
  });
