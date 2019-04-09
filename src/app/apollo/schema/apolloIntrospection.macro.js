import mergedSchema from "./mergedSchema";
import apolloIntrospection from "../../../../scripts/util/apolloIntrospection";

export default () => {
  return `module.exports = ${JSON.stringify(
    apolloIntrospection(mergedSchema),
  )}`;
};
