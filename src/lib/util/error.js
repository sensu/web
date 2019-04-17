import FetchError from "/lib/error/FetchError";
import ReactError from "/lib/error/ReactError";
import { isApolloError } from "apollo-client/errors/ApolloError";

export const unwrapError = error => {
  if (error instanceof Error) {
    const meta = {};

    if (error instanceof ReactError) {
      return {
        componentStack: error.componentStack,
        ...unwrapError(error.original),
      };
    }

    if (isApolloError(error) && error.networkError) {
      return unwrapError(error.networkError);
    }

    if (error instanceof FetchError) {
      if (error.original) {
        return {
          url: error.url,
          statusCode: error.statusCode,
          ...unwrapError(error.original),
        };
      }

      meta.url = error.url;
      meta.statusCode = error.statusCode;
    }

    return {
      ...meta,
      name: error.name,
      stack: error.stack,
      message: error.message,
    };
  }

  return { message: `${error}`, stack: "", name: "Error" };
};
