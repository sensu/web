const graphql = require("graphql");

const schema = require("./apollo/schema/mergedSchema");

module.exports = {
  plugins: ["graphql"],
  rules: {
    // https://github.com/apollographql/eslint-plugin-graphql
    "graphql/template-strings": [
      "error",
      {
        env: "apollo",
        schemaJson: graphql.introspectionFromSchema(schema),
      },
    ],
  },
};
