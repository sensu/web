const esm = require("esm")(module);
const base = esm("../config/base.webpack.config.js");
const makeConfig = base.default;

module.exports = async ({ config }) => {
  const base = makeConfig({ omitFileLoader: true });

  return {
    ...config,
    resolve: {
      ...config.resolve,
      extensions: [...base.resolve.extensions, ".mjs", ".ejs"],
    },
    module: {
      ...config.module,
      rules: base.module.rules,
    },
  };
};
