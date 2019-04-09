/**
 * Emits results of introspection query using combined server and client
 * additions. In this way clients of the schema and any other tooling (GrapiQL
 * and friends) can be aware of client fields / types as well.
 *
 * This emits a large file, but it is not loaded by the browser during normal
 * app operation - only by dev tooling when the schema definition is required.
 */

const graphql = __non_webpack_require__("graphql");
const mergedSchema = __non_webpack_require__("./mergedSchema");

export default ({ emitFile }) => {
  return emitFile(
    "schema.json",
    JSON.stringify({ data: graphql.introspectionFromSchema(mergedSchema) }),
  );
};
