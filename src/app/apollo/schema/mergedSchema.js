const fs = require("fs");
const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require("glob");
// eslint-disable-next-line import/no-extraneous-dependencies
const graphql = require("graphql");

const libSchema = require("../../../lib/apollo/schema/mergedSchema");

const clientSchemaPath = path.join(__dirname, "../resolvers/*.graphql");

const clientSchemaFilePaths = glob.sync(clientSchemaPath);

const rawClientSchema = clientSchemaFilePaths.reduce(
  (acc, f) => acc + fs.readFileSync(f, "utf-8"),
  "",
);

const clientSchemaDoc = graphql.parse(rawClientSchema);

const schema = graphql.extendSchema(libSchema, clientSchemaDoc);

module.exports = schema;
