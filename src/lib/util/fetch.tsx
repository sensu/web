import {
  FailedError,
  ClientError,
  UnauthorizedError,
  ServerError,
} from "/lib/error/FetchError";

function customFetch(
  input: RequestInfo,
  config: RequestInit,
): Promise<Response> {
  // Wrap fetch call in bluebird promise to enable global rejection tracking
  return Promise.resolve(fetch(input, config)).then(
    (response: Response): Response => {
      if (response.status === 0) {
        // The request failed for one of a number of possible reasons:
        //  - blocked by CORS
        //  - blocked by a content blocker browser extension
        //  - blocked by a firewall
        //
        // Unfortunately the specific case is not made available. (I suspect the
        // browser doesn't provide more detail in order to protect the user from
        // potentially harmful scripts. It's worth noting that specific details
        // are often logged to the dev tools console).

        throw new FailedError(response.status, input, response);
      }

      if (response.status >= 500) {
        throw new ServerError(response.status, input, response);
      }

      if (response.status >= 400) {
        if (response.status === 401) {
          throw new UnauthorizedError(response.status, input, response);
        }
        throw new ClientError(response.status, input, response);
      }

      return response;
    },
    (error: Error): Response => {
      throw new FailedError(0, input, null, error);
    },
  );
}

export default customFetch;
