import fs from "fs";
import path from "path";

import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";

import makeConfig from "./base.webpack.config";

const root = fs.realpathSync(process.cwd());
const outputPath =
  process.env.NODE_ENV === "development"
    ? path.join(root, "build/vendor-dev")
    : path.join(root, "build/vendor");

const vendorConfig = makeConfig({
  name: "vendor",

  entry: {
    vendor: [
      "@material-ui/core",
      "apollo-cache-inmemory",
      "apollo-client",
      "apollo-link",
      "apollo-link-batch-http",
      "apollo-link-context",
      "classnames",
      "fbjs",
      "graphql-tag",
      "prop-types",
      "react",
      "react-apollo",
      "react-dom",
      "react-resize-observer",
      "react-router-dom",
      "react-spring",
    ],
  },

  output: {
    path: path.join(outputPath, "public"),
    publicPath: "/",
    devtoolNamespace: "vendor",
  },

  optimization: {
    // Disable "tree-shaking" by disabling es module export optimization.
    providedExports: false,
    usedExports: false,
  },

  plugins: [new CleanPlugin(outputPath, { root })],
});

vendorConfig.plugins.push(
  new webpack.DllPlugin({
    name: vendorConfig.output.library,
    path: path.join(outputPath, "dll.json"),
  }),
);

export default vendorConfig;
