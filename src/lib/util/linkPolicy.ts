import globToRegexp from "glob-to-regexp";
import newURL, { isRelativeURL } from "./url";

interface Policy {
  allowList: boolean;
  URLs: string[];
}

function shouldAllowLink(policy: Policy, link: URL): boolean {
  const isMatch = policy.URLs.some((glob) => {
    const globURL = newURL(glob);
    if (!isRelativeURL(globURL) && globURL.protocol !== link.protocol) {
      return false;
    }
    const pattern = globToRegexp(globURL.hostname);
    return pattern.test(link.hostname);
  });
  if (policy.allowList) {
    return isMatch;
  }
  return !isMatch;
}

export default shouldAllowLink;
