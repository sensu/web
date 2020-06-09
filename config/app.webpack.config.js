/* eslint-disable import/no-dynamic-require */
import fs from "fs";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanPlugin from "clean-webpack-plugin";

import makeConfig from "./base.webpack.config";

const root = fs.realpathSync(process.cwd());
const outputPath = path.join(root, "build/app");

export default makeConfig({
  name: "app",

  entry: {
    app: [path.join(root, "src/app")],
  },

  output: {
    path: outputPath,
    publicPath: "/",
  },

  plugins: [
    new CleanPlugin(outputPath, { root }),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(root, "src/lib/static/index.html"),
      minify: process.env.NODE_ENV !== "development" && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
});
