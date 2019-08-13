import { when } from "/lib/util/promise";
import { UnauthorizedError } from "/lib/error/FetchError";

export const fetchNamespaces = ({ accessToken }) => {
  const path = "/api/core/v2/namespaces";
  const config = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return fetch(path, config)
    .then(response => response.json())
    .catch(when(UnauthorizedError, () => {}));
};
