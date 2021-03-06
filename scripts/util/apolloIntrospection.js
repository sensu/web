import { execute, parse } from "graphql";

export default schema => {
  // Apollo only needs to be aware of the possible types unions and interfaces
  // may contain. So instead of retrieving the entire schema, we simply retrieve
  // the names and possibleTypes.
  //
  // More: https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
  //
  const queryAST = parse(
    `
      query IntrospectionQuery {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  );
  const result = execute(schema, queryAST);
  if (result.errors) {
    throw result.errors;
  }

  // https://github.com/apollographql/apollo-client/blob/2701b0acb89711864bde28341cb5cfcf909d2caf/packages/apollo-cache-inmemory/src/fragmentMatcher.ts#L149-L155
  const filteredTypes = result.data.__schema.types.filter(
    type => type.kind === "UNION" || type.kind === "INTERFACE",
  );
  result.data.__schema.types = filteredTypes;
  return result.data;
};
