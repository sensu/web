import React, { useState, useMemo } from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";
import useQuery from "./useQuery";
// TODO rename NamespacesContext to NamespacesProvider
// TODO useNamespaces (instead of withNavagation, as a hook)
import { NamespacesContext } from "/lib/util/NamespacesContext";
import { fetchNamespaces } from "/lib/util/namespaceAPI";

const query = gql`
  query AuthQuery {
    auth @client {
      accessToken
    }
  }
`;

const SyncNamespaces = ({ children }) => {
  const namespaceQuery = useQuery({
    query: query,
    onError: err => {
      if (err.networkError instanceof FailedError) {
        return;
      }

      throw err;
    },
  });

  // TODO: deal with error/empty case for query
  // TODO: deal with weird results from fetchNamespaces too
  const [namespaces, setNamespaces] = useState([]);
  useMemo(() => {
    fetchNamespaces(namespaceQuery.data.auth)
      .then(data => {
        setNamespaces(data);
      })
      .catch(console.error);
    // eslint-disable-next-line
  }, []);
  return (
    <NamespacesContext.Provider value={namespaces}>
      {children}
    </NamespacesContext.Provider>
  );
};

export default SyncNamespaces;
