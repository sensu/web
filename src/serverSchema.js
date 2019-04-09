const fs = require("fs");
const path = require("path");
const glob = require("glob");
const graphql = require("graphql");

const serverSchemaPath = path.resolve(".schema/*.graphql");

// Support legacy SDL spec; graphl-go support pending.
// https://github.com/graphql/graphql-js/blob/v0.13.0/src/language/parser.js#L89-L97
const parserOpts = { allowLegacySDLImplementsInterfaces: true };

const serverSchemaFilePaths = glob.sync(serverSchemaPath);
let rawServerSchema = serverSchemaFilePaths.reduce(
  (acc, f) => acc + fs.readFileSync(f, {}),
  "",
);

//
// NOTE:
//
// DateTime is defined by the graphql-go package and since we are not
// pulling the schema down from a running instance of the backend we
// must define it manually.
//
// Ideally the server's schema defines the scalar itself, however, the code
// generator does not support ignoring a type at this moment.
//
rawServerSchema += `
  """
  The DateTime scalar type represents a DateTime.
  The DateTime is serialized as an RFC 3339 quoted string.
  """
  scalar DateTime
  `;

const serverSchemaDoc = graphql.parse(rawServerSchema, parserOpts);

module.exports = graphql.buildASTSchema(serverSchemaDoc);
