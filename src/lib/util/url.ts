const relativeProto = "is-relative-proto:";

export function isRelativeURL(url: URL) {
  return url.protocol === relativeProto;
}

export function URLToString(url: URL): string {
  if (isRelativeURL(url)) {
    return url.toString().slice(relativeProto.length);
  }
  return url.toString();
}

export default function newURL(url: string): URL {
  // the URL constructor doesn't support protocol relative URLs.
  if (url.slice(0, 2) === "//") {
    url = relativeProto + url;
  }
  return new URL(url);
}
