const fs = require("fs");
const graphql = require("graphql");
const serverSchema = require("../../../serverSchema");

const rawClientSchema = fs.readFileSync(
  require.resolve("./client.graphql"),
  "utf-8",
);
const clientSchemaDoc = graphql.parse(rawClientSchema);

const schema = graphql.extendSchema(serverSchema, clientSchemaDoc);

module.exports = schema;
