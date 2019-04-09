// const fs = require("fs");
// const path = require("path");
// const graphql = require("graphql");
const libSchema = require("../../../lib/apollo/schema/mergedSchema");

// const rawClientSchema = fs.readFileSync(
//   path.join(__dirname, "client.graphql"),
//   "utf-8",
// );
// const clientSchemaDoc = graphql.parse(rawClientSchema);
//
// const schema = graphql.extendSchema(libSchema, clientSchemaDoc);
//
// module.exports = schema;

module.exports = libSchema;
