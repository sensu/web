const graphql = require("graphql");

const schema = require("../app/apollo/schema/mergedSchema");

const disabledRules = [
  "NoUnusedFragments",
  "KnownFragmentNames",
  "NoUnusedVariables",
];

module.exports = {
  plugins: ["graphql"],
  rules: {
    // https://github.com/apollographql/eslint-plugin-graphql
    "graphql/template-strings": [
      "error",
      {
        env: "apollo",
        schemaJson: graphql.introspectionFromSchema(schema),
        validators: graphql.specifiedRules
          .map(rule => rule.name)
          .filter(ruleName => !disabledRules.includes(ruleName)),
      },
    ],
  },
};
