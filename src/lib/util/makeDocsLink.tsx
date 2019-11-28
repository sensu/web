const host = "https://docs.sensu.io";
const defaultComponent = "sensu-go";
const versionFallback = "latest";

interface Opts {
  version?: string;
  component?: string;
  path: string;
}

const makeDocsLink = ({ version: versionArg, component, path }: Opts) => {
  // Sensu docs are only produced for major and minor versions
  let version = versionArg || "";
  let matches = version.match(/^v?(\d\.\d+)/i);
  if (matches && matches.length > 1) {
    version = matches[1];
  } else if (version === "") {
    version = versionFallback;
  }

  return `${host}/${component || defaultComponent}/${version}${path}`;
};

export default makeDocsLink;
