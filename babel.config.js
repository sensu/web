// eslint-disable-next-line
const path = require("path");

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "> 0.5%, not IE 11",
        // Disable polyfill transforms.
        useBuiltIns: false,
        // Do not transform es6 modules, required for webpack "tree shaking".
        modules: false,
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: true,
      },
    ],
    [
      "module-resolver",
      {
        alias: {
          "": path.join(__dirname, "src"),
        },
        extensions: [".tsx", ".ts", ".jsx", ".js"],
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
            // Disable polyfill transforms.
            useBuiltIns: false,
            // Transform modules to CJS for node runtime.
            modules: "commonjs",
          },
        ],
      ],
    },
    production: {
      plugins: [
        [
          "transform-react-remove-prop-types",
          {
            removeImport: true,
          },
        ],
      ],
    },
  },
};
