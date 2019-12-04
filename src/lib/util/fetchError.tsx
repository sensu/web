import { FailedError, ServerError } from "/lib/error/FetchError";

export const isUnreachable = (err?: Error | null) => {
  // If no response was received from the target server then it should be fair
  // to say that the server is unreachable. Sadly, the web platform doesn't
  // really give us much more information, so we easily determine the root
  // cause. (eg. DNS, local connection issues, etc.)
  if (err instanceof FailedError) {
    return true;
  }

  // The 502, 503, & 504 all status codes generally refer to situations where
  // the HTTP request was unable to reach it's target.
  if (err instanceof ServerError && err.statusCode >= 502) {
    return true;
  }

  return false;
};
