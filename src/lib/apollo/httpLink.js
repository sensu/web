import { ApolloLink } from "apollo-link";
import { BatchHttpLink as HttpLink } from "apollo-link-batch-http";
import createFetch from "/lib/util/fetch";

const httpLink = () =>
  new ApolloLink(operation => {
    const { cache } = operation.getContext();

    const link = new HttpLink({
      uri: "/graphql",
      fetch: createFetch(cache),
      credentials: "same-origin",
      batchMax: 10,
      batchInterval: 3,
    });

    return link.request(operation);
  });

export default httpLink;
