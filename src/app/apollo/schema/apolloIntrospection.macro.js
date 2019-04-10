const apolloIntrospection = __non_webpack_require__(
  "../../../../scripts/util/apolloIntrospection",
).default;
const mergedSchema = __non_webpack_require__("./mergedSchema");

export default () => {
  return `module.exports = ${JSON.stringify(
    apolloIntrospection(mergedSchema),
  )}`;
};
