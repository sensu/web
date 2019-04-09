// const fs = require("fs");
// const graphql = require("graphql");
const libSchema = require("../../../lib/apollo/schema/mergedSchema.js");

// const rawClientSchema = fs.readFileSync(
//   require.resolve("./client.graphql"),
//   "utf-8",
// );
// const clientSchemaDoc = graphql.parse(rawClientSchema);
//
// const schema = graphql.extendSchema(libSchema, clientSchemaDoc);
//
// module.exports = schema;

module.exports = libSchema;
