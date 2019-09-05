const loaderUtils = require("loader-utils");
const path = require("path");

module.exports = {
  default: (content) => {
    const context = this;
    const options = loaderUtils.getOptions(context);

    return content.default({
      ...context,
      content: JSON.stringify(content),
      emitFile(relativePath, fileContent, emitOptions) {
        const currentOptions = {
          filename: "[name].[ext]",
          ...options,
          ...emitOptions,
        };

        const resourcePath = path.join(
          path.dirname(context.resourcePath),
          relativePath,
        );

        const filename = loaderUtils.interpolateName(
          { ...context, resourcePath },
          currentOptions.filename,
          { content: fileContent },
        );

        context.emitFile(filename, fileContent);

        return `module.exports = __webpack_public_path__ + ${JSON.stringify(
          filename,
        )}`;
      },
    });
  },
  raw: true,
};
