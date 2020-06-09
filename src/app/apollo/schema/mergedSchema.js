const fs = require("fs");
const path = require("path");
const glob = require("glob");
const graphql = require("graphql");

const serverSchema = require("../../../serverSchema");

const clientSchemaPath = path.join(__dirname, "../resolvers/*.graphql");

const clientSchemaFilePaths = [
  path.join(__dirname, "client.graphql"),
  ...glob.sync(clientSchemaPath),
];

const rawClientSchema = clientSchemaFilePaths.reduce(
  (acc, f) => acc + fs.readFileSync(f, "utf-8"),
  "",
);

const clientSchemaDoc = graphql.parse(rawClientSchema);

const schema = graphql.extendSchema(serverSchema, clientSchemaDoc);

module.exports = schema;
